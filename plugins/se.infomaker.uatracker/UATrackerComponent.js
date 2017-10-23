//http://dev.lca.infomaker.io/

import io from 'socket.io-client'
import {Component} from 'substance'
import { api, moment, event } from 'writer'
import LoginComponent from './LoginComponent'
import NoConnection from './NoConnection'
import UserList from './UserList'

const pluginId = 'se.infomaker.uatracker'

class UATrackerComponent extends Component {

    constructor(...args) {
        super(...args)
        api.events.on(pluginId, event.DOCUMENT_CHANGED, (e) => {
            this._onDocumentChanged()
        })

        api.events.on(pluginId, event.DOCUMENT_SAVED, () => {
            this._onDocumentSaved()
        })
    }

    dispose() {
        api.events.off(pluginId, event.DOCUMENT_CHANGED)
        api.events.off(pluginId, event.DOCUMENT_SAVED)
        this.socket.close()
    }

    getInitialState() {
        return {
            username: null,
            email: null,
            users: [],
            lockedBy: null
        }
    }


    didMount() {
        // If no username specified make sure to show dialog

        this.showLogin()

    }

    _onDocumentChanged() {
        if (!this.state.lockedBy) {
            this.extendState({
                lockedBy: this.socket.id
            })

            // Only send lock information if article has a uuid
            if (this.articleInformation.uuid) {
                console.log('Locking article: Article has changed and the article has a UUID')
                this.socket.emit('article/locked', this.articleInformation)
            }
        }
    }

    _onDocumentSaved() {
        console.log('DOCUMENT SAVED', this.articleInformation)
        this.extendState({
            lockedBy: null
        })

        // Only unlock article if user has socketId
        if (this.articleInformation.socketId) {
            console.log('Unlocking article: Article has been saved and I have a socket ID')
            this.socket.emit('article/unlocked', this.articleInformation)
        }
    }

    showLogin() {
        if (api.history.isAvailable()) {
            const user = api.history.storage.getItem('user')
            if (user) {
                this.login(JSON.parse(user))
            } else {
                api.ui.showDialog(LoginComponent, {login: this.userLogin.bind(this)}, {
                    title: this.getLabel("uatracker-dialog-title"),
                    primary: this.getLabel('Continue'),
                    secondary: false,
                    disableEscKey: true
                })
            }
        }
    }

    lockArticle() {
        console.log('-LOCKING ARTICLE-')
    }

    unlockArticle() {
        console.log('-UNLOCKING ARTICLE-')
    }


    socketConnectError() {
        this.props.popover.setIcon('fa-chain-broken')
        this.props.popover.setStatusText(this.getLabel('uatracker-no-connetion'))
        this.extendState({
            users: [],
            socketId: null,
            socketError: true
        })
    }

    get articleInformation() {
        const uuid = api.newsItem.getGuid()
        const customerKey = api.getConfigValue('se.infomaker.uatracker', 'customerKey')
        return {
            uuid: uuid,
            timestamp: moment().format('x'),
            socketId: this.socket.id,
            customerKey: customerKey,
            name: this.state.name,
            email: this.state.email
        }
    }

    setupLiveArticles() {

        const host = api.getConfigValue('se.infomaker.uatracker', 'host')

        this.socket = io(host)

        this.socket.on('connect_error', this.socketConnectError.bind(this))

        this.socket.on('error', () => {
            // Handle error
        })

        this.socket.on('connect', () => {
            this.updateIcon([])
            this.extendState({
                socketError: false
            })

            /*
             Trigger an event telling the server that we have opened this article
             */
            this.socket.emit('article/opened', this.articleInformation)

            this.socket.on('article/user-change', (users) => {
                console.log('Received article/user-change', users)

                this.extendState({
                    users: users,
                    socketId: this.socket.id
                })
                this.updateIcon(users)
            })

            this.socket.on('article/lock-status-change', (lockStatus) => {
                console.log('Received article/lock-status-change', lockStatus)
                this.extendState({
                    lockedBy: lockStatus.lockedBy
                })
                this.setLockStatus(lockStatus.lockedBy)
            })
        })
    }

    setLockStatus(lockedBy) {
        if (lockedBy) {
            this.props.popover.setIcon('fa-lock')
            const lockedByUser = this.state.users.find(user => user.socketId === lockedBy)
            this.props.popover.setStatusText('Locked by ' + lockedByUser.name)
        } else {
            this.props.popover.setIcon('fa-unlock')
            this.props.popover.setStatusText('Not locked')
        }
    }

    updateIcon(users) {
        if (users.length > 1) {
            this.props.popover.setIcon('fa-group')
            this.props.popover.setStatusText(users.length + this.getLabel('connected-users-qty-connected'))
        } else {
            this.props.popover.setIcon('fa-user')
            this.props.popover.setStatusText(this.state.name)
        }
    }

    login({email, name}) {

        this.extendState({
            email: email,
            name: name
        })
        this.setupLiveArticles()
    }

    userLogin(user) {
        if (api.history.isAvailable()) {
            api.history.storage.setItem('user', JSON.stringify(user))
        }
        this.login(user)

    }

    logout() {
        if (api.history.isAvailable()) {
            api.history.storage.removeItem('user')
            this.socket.close()
            this.showLogin()
        }
        this.extendState({
            email: null,
            name: null,
            socketId: null
        })
    }

    render($$) {
        const el = $$('div').addClass('uatracker')

        if(this.state.socketError) {
            const noConnectionEl = $$(NoConnection)
            el.append(noConnectionEl)
        } else {
            const userListEl = $$(UserList, {users: this.state.users, socketId: this.state.socketId})
            el.append(userListEl)
        }



        if (this.state.email) {
            const logoutButton = $$('button').addClass('btn sc-np-btn btn-secondary').append(this.getLabel('Logout')).on('click', this.logout)
            el.append(logoutButton)
        }


        return el
    }
}

export default UATrackerComponent

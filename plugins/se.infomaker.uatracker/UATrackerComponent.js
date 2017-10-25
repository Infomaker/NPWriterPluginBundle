//http://dev.lca.infomaker.io/

import io from 'socket.io-client'
import {Component} from 'substance'
import { api, moment, event } from 'writer'
import LoginComponent from './LoginComponent'
import NoConnection from './NoConnection'
import UserList from './UserList'
import Lock from './Lock'
import Dialog from './Dialog'

const pluginId = 'se.infomaker.uatracker'

class UATrackerComponent extends Component {

    constructor(...args) {
        super(...args)
        api.events.on(pluginId, event.DOCUMENT_CHANGED, this._onDocumentChanged.bind(this))
        api.events.on(pluginId, event.DOCUMENT_SAVED, this._onDocumentSaved.bind(this))
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
        this.showLogin()
    }

    _onDocumentChanged() {
        if (!this.state.lockedBy) {
            // Article is not locked by anyone, so we reserve it for ourselves.
            this.reserveArticle()
        } else {
            // Article is already locked, either by us or by someone else. Do nothing.
            this.showArticleLockedDialog()
            console.log('\t[UATracker] Not locking: Document is already locked')
        }
    }

    _onDocumentSaved() {
        // On save, wheter we have locked the article or not, release the article lock
        // to let all other users know it has been updated.
        // Save should be disabled elsewhere if the article is not locked by us.
        this.releaseArticle()
    }


    reserveArticle() {
        this.extendState({
            lockedBy: this.socket.id
        })

        // Only send lock information if article has a uuid.
        if (this.articleInformation.uuid) {
            // Trigger an event telling the server that we have locked this article
            this.socket.emit('article/locked', this.articleInformation)
            console.log('\t[UATracker] Reserving article: Article has changed and the article has a UUID')
        }
    }

    releaseArticle() {
        this.extendState({
            lockedBy: null
        })

        // Only unlock article if user has socketId
        if (this.articleInformation.socketId) {
            // Trigger an event telling the server that we have unlocked this article
            this.socket.emit('article/unlocked', this.articleInformation)
            console.log('\t[UATracker] Releasing article: Article has been saved and I have a socket ID')
        }
    }

    lockArticle() {
        api.events.userActionLock()
    }

    unlockArticle() {
        api.events.userActionUnlock()
    }

    socketConnectError() {
        // this.props.popover.setIcon('fa-chain-broken')
        // this.props.popover.setStatusText(this.getLabel('uatracker-no-connetion'))
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
            this.extendState({
                socketError: false
            })

            /*
             Trigger an event telling the server that we have opened this article
             */
            this.socket.emit('article/opened', this.articleInformation)

            this.socket.on('article/user-change', (users) => {
                console.log('\t[UATracker] Received: article/user-change', users)

                this.extendState({
                    users: users,
                    socketId: this.socket.id
                })

            })

            this.socket.on('article/lock-status-change', (lockStatus) => {
                console.log('\t[UATracker] Received: article/lock-status-change', lockStatus)
                this.extendState({
                    lockedBy: lockStatus.lockedBy
                })
                this.setLockStatus(lockStatus.lockedBy)
            })
        })
    }

    setLockStatus(lockedBy) {
        if (lockedBy) {

            if(lockedBy === this.socket.id) {
                // Active user has locked the article
            } else {
                this.lockArticle()
            }

        } else {
            this.unlockArticle()
        }
    }

    showArticleLockedDialog() {
        const dialogProps = {
            message: 'För att göra ändringar i artikeln måste du låsa upp den först.',
        }
        const dialogOptions = {
            heading: 'Artikeln är låst och inga ändringar du gör kommer att sparas',
            primary: 'Jag förstår',
            secondary: false,
            center: false
        }

        api.ui.showDialog(Dialog, dialogProps, dialogOptions)
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
        const el = $$('div')
        const container = $$('div').addClass('sc-np-bar-container uatracker')
        el.append(container)

        if (this.state.socketError) {
            // Show connection error icon
        } else if (this.state.users.length) {
            // Show user list if there are users
            const userListElem = $$(UserList, {
                users: this.state.users,
                socketId: this.state.socketId,
                lockedBy: this.state.lockedBy
            }).ref('userList')

            const lockElem = $$(Lock, {
                socketId: this.state.socketId,
                lockedBy: this.state.lockedBy,
                reserveArticle: this.reserveArticle.bind(this)
            })
            container.append([userListElem, lockElem])
        }

        // if(this.state.socketError) {
        //     const noConnectionEl = $$(NoConnection)
        //     el.append(noConnectionEl)
        // } else {
        //     const userListEl = $$(UserList, {users: this.state.users, socketId: this.state.socketId})
        //     el.append(userListEl)
        // }

        // if (this.state.email) {
        //     const logoutButton = $$('button').addClass('btn sc-np-btn btn-secondary').append(this.getLabel('Logout')).on('click', this.logout)
        //     el.append(logoutButton)
        // }

        return el
    }
}

export default UATrackerComponent

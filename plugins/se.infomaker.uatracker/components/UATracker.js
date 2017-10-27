import io from 'socket.io-client'
import { Component } from 'substance'
import { api, moment, event } from 'writer'

import Login from './Login'
import Dialog from './Dialog'
import UserListBarItem from './UserListBarItem'
import LockButtonBarItem from './LockButtonBarItem'
import NoConnectionBarItem from './NoConnectionBarItem'

import '../scss/UATracker.scss'

const pluginId = 'se.infomaker.uatracker'

class UATracker extends Component {

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
            // Article is not locked by anyone, so we reserve it for active user
            this.reserveArticle()
        } else if (this.state.lockedBy !== this.socket.id) {
            // Article is locked by someone else
            this.showArticleLockedDialog()
        } else {
            // Article is locked by active user
        }
    }

    _onDocumentSaved() {
        // On save, wheter we have locked the article or not, release the article lock
        // to let all other users know it has been updated.
        // Save should be disabled elsewhere if the article is not locked by us.
        this.releaseArticle()
    }


    reserveArticle() {
        this.extendState({ lockedBy: this.socket.id })

        // Only send lock information if article has a uuid.
        if (this.articleInformation.uuid) {
            // Trigger an event telling the socket server that we have locked this article
            this.socket.emit('article/locked', this.articleInformation)
        }
    }

    releaseArticle() {
        this.extendState({ lockedBy: null })

        // Only unlock article if user has socketId
        if (this.articleInformation.socketId) {
            // Trigger an event telling the socket server that we have unlocked this article
            this.socket.emit('article/unlocked', this.articleInformation)
        }
    }

    lockArticle() {
        api.events.userActionLock()
    }

    unlockArticle() {
        api.events.userActionUnlock()
    }

    onSocketConnectError() {
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

        this.socket.on('error', () => {})
        this.socket.on('connect', () => this.onConnect())
        this.socket.on('connect_error', () => this.onSocketConnectError())
        this.socket.on('article/user-change', (users) => this.onUserChange(users))
        this.socket.on('article/lock-status-change', (lockStatus) => this.onLockStatusChange(lockStatus))
    }

    onConnect() {
        this.extendState({ socketError: false })
        this.socket.emit('article/opened', this.articleInformation)
    }

    onUserChange(users) {
        users = users.map(this.setIsActiveUser.bind(this))
        this.extendState({
            users: users,
            socketId: this.socket.id // Varför uppdaterar jag socket id här?
        })
    }

    onLockStatusChange({lockedBy}) {
        const lockedByActiveUser = this.state.lockedBy === this.state.socketId

        if (lockedByActiveUser && lockedBy !== this.state.socketId) {
            this.showLockTakenOverDialog()
        }

        this.extendState({
            lockedBy: lockedBy
        })

        this.setLockStatus(lockedBy)
    }

    setIsActiveUser(user) {
        user.isActiveUser = this.socket.id === user.socketId
        return user
    }

    setLockStatus(lockedBy) {
        if (lockedBy && lockedBy !== this.socket.id) {
            // Locked by other user
            this.lockArticle()
        } else {
            // Not locked or locked by active user
            this.unlockArticle()
        }
    }

    showArticleLockedDialog() {
        const dialogProps = {
            message: this.getLabel('uatracker-article-locked-message'),
        }
        const dialogOptions = {
            heading: this.getLabel('uatracker-article-locked-title'),
            primary: this.getLabel('confirm-understand'),
            secondary: false,
            center: false
        }

        api.ui.showDialog(Dialog, dialogProps, dialogOptions)
    }

    showLockTakenOverDialog() {
        const dialogProps = {
            message: this.getLabel('uatracker-article-taken-over-message'),
        }
        const dialogOptions = {
            heading: this.getLabel('uatracker-article-taken-over-title'),
            primary: this.getLabel('confirm-understand'),
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
                api.ui.showDialog(Login, { login: this.userLogin.bind(this) }, {
                    title: this.getLabel('uatracker-dialog-title'),
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
            container.append($$(NoConnectionBarItem).ref('no-connection'))
        } else if (this.state.users.length) {
            // Show user list if there are users
            const userListElem = $$(UserListBarItem, {
                users: this.state.users,
                socketId: this.state.socketId,
                lockedBy: this.state.lockedBy,
                logout : this.logout.bind(this)
            }).ref('user-list')

            const lockElem = $$(LockButtonBarItem, {
                socketId: this.state.socketId,
                lockedBy: this.state.lockedBy,
                reserveArticle: this.reserveArticle.bind(this)
            })
            container.append([userListElem, lockElem])
        }

        return el
    }
}

export default UATracker

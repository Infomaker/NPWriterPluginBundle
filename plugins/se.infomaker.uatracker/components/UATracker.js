import io from 'socket.io-client'
import { Component } from 'substance'
import { api, moment, event } from 'writer'

import Login from './Login'
import Dialog from './Dialog'
import UserListBarItem from './UserListBarItem'
import LockButtonBarItem from './LockButtonBarItem'
import NoConnectionBarItem from './NoConnectionBarItem'

import '../scss/uatracker.scss'
import '../scss/no-connection.scss'
import '../scss/login.scss'
import '../scss/user.scss'
import '../scss/lock.scss'

const pluginId = 'se.infomaker.uatracker'

/**
 * An object sent back by the UA tracker socket server whenever a new user joins the article.
 * @typedef {Object} User
 * @property {boolean} isActiveUser - If the user is the one currently viewing the article
 * @property {string} name - The users full name
 * @property {string} email - The users email address
 * @property {string} timestamp - When the user first connected to the tracker
 * @property {string} uuid - The current article UUID
 * @property {string} socketId - The users socket ID
 * @property {string} customerKey - customerKey from config
 */

/**
 * Renders a list of users curretly viewing the article, their lock status, and the articles
 * lock status.
 * Intended to be used in the top bar.
 *
 * @class UATracker
 * @extends {Component}
 * @example
    config.addTopBarComponent('uatracker', { align: 'right' }, UATrackerComponent)
 */

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
        this.socket.on('article/version-change', (versionData) => this.onVersionChange(versionData))
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
            const user = this.state.users.find(u => u.socketId === lockedBy)
            this.showLockTakenOverDialog(user)
        }

        this.extendState({
            lockedBy: lockedBy
        })

        this.setLockStatus(lockedBy)
    }

    onVersionChange({ savedBy }) {
        if (savedBy !== this.socket.id) {
            this.showArticleOutdatedDialog()
        }
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

    showLockTakenOverDialog(user) {
        const dialogProps = {
            message: this.getLabel('uatracker-article-taken-over-message')
                .replace('{{name}}', user.name)
                .replace('{{email}}', user.email),
        }
        const dialogOptions = {
            heading: this.getLabel('uatracker-article-taken-over-title'),
            primary: this.getLabel('confirm-understand'),
            secondary: false,
            center: false
        }

        api.ui.showDialog(Dialog, dialogProps, dialogOptions)
    }

    showArticleOutdatedDialog() {
        const dialogProps = {
            message: this.getLabel('uatracker-article-outdated-message'),
        }
        const dialogOptions = {
            heading: this.getLabel('uatracker-article-outdated-title'),
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
            socketId: null,
            users: []
        })
    }

    render($$) {
        const el = $$('div')
        const container = $$('div').addClass('sc-np-bar-container uatracker')
        el.append(container)

        if (this.state.socketError) {
            container.append($$(NoConnectionBarItem).ref('no-connection'))
        } else if (this.state.users.length && this.state.email) {
            // Show user list if there are users
            const userListElem = $$(UserListBarItem, {
                users: this.state.users,
                socketId: this.state.socketId,
                lockedBy: this.state.lockedBy,
                limit: 5,
                logout: this.logout.bind(this)
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

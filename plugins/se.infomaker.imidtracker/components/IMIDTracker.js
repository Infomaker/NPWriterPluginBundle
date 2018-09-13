'use strict'

import {Component} from 'substance'
import {api, moment, event} from 'writer'
import io from "socket.io-client"

import Dialog from './Dialog'
import UserListBarItem from './UserListBarItem'
import LockButtonBarItem from './LockButtonBarItem'
import NoConnectionBarItem from "./NoConnectionBarItem"

const pluginId = 'se.infomaker.imidtracker'


class IMIDTracker extends Component {

    constructor(...args) {
        super(...args)

        api.events.on(pluginId, event.DOCUMENT_CHANGED, this._onDocumentChanged.bind(this))
        api.events.on(pluginId, event.DOCUMENT_SAVED, this._onDocumentSaved.bind(this))

        this._onConnect = this._onConnect.bind(this)
        this._onSocketConnectError = this._onSocketConnectError.bind(this)
        this._onUserChange = this._onUserChange.bind(this)
        this._onLockStatusChange = this._onLockStatusChange.bind(this)
        this._onVersionChange = this._onVersionChange.bind(this)
        this._setIsActiveUser = this._setIsActiveUser.bind(this)
        this._userLogin = this._userLogin.bind(this)
    }

    dispose() {
        api.events.off(pluginId, event.DOCUMENT_CHANGED)
        api.events.off(pluginId, event.DOCUMENT_SAVED)
        this._closeSocket()
    }

    getInitialState() {
        return {
            username: null,
            email: null,
            users: [],
            lockedBy: null,
            articleOutdated: false
        }
    }

    didMount() {
        const {isSaving} = this.props

        if (!isSaving) {
            this._getAuthUser()
                .then(user => {
                    this._userLogin(user)
                })
                .catch(error => {
                    console.error(error)
                })
        }
    }

    render($$) {
        const el = $$('div')
        const container = $$('div')
            .addClass('sc-np-bar-container imidtracker')

        if (this.state.socketError) {
            container.append($$(NoConnectionBarItem).ref('no-connection'))
        } else if (this.state.users.length) {
            // Show user list if there are users
            const userListElem = $$(UserListBarItem, {
                users: this.state.users,
                socketId: this.state.socketId,
                lockedBy: this.state.lockedBy,
                limit: 5,
                logout: this._logout.bind(this)
            }).ref('user-list')

            const lockElem = $$(LockButtonBarItem, {
                socketId: this.state.socketId,
                lockedBy: this.state.lockedBy,
                reserveArticle: this._reserveArticle.bind(this)
            })

            container.append([userListElem, lockElem])
        }

        el.append(container)

        return el
    }

    get _articleInformation() {
        const uuid = api.newsItem.getGuid()
        const customerKey = api.getConfigValue('se.infomaker.imidtracker', 'customerKey')

        return {
            uuid: uuid,
            timestamp: moment().format('x'),
            socketId: this.socket.id,
            customerKey: customerKey,
            name: this.state.name,
            email: this.state.email,
            picture: this.state.picture
        }
    }

    _reserveArticle() {
        // Only send lock information if article has a uuid.
        if (this._articleInformation.uuid) {
            this.extendState({lockedBy: this.socket.id})

            if (this._useUATracker()) {
                // Trigger an event telling the socket server that we have locked this article
                this.socket.emit('article/locked', this._articleInformation)
            }
        }
    }

    _releaseArticle() {
        this.extendState({lockedBy: null})

        if (this._useUATracker()) {
            // On save, regardless if we have locked the article or not, release the article lock
            // to let all other users know it has been updated.
            // Save should be disabled elsewhere if the article is not locked by us.

            // Only unlock article if user has socketId
            if (this._articleInformation.socketId) {
                // Trigger an event telling the socket server that we have unlocked this article
                this.socket.emit('article/unlocked', this._articleInformation)
            }
        }
    }

    _onConnect() {
        this.extendState({socketError: false})
        this.socket.emit('article/opened', this._articleInformation)
    }

    _onSocketConnectError() {
        this.extendState({
            users: [],
            socketId: null,
            socketError: true
        })
    }

    _onUserChange(users) {
        users = users.map(this._setIsActiveUser)

        this.extendState({
            users: users,
            socketId: this.socket.id // TODO: Maybe move this to _onConnect
        })

    }

    _onLockStatusChange({lockedBy}) {
        const lockedByActiveUser = this.state.lockedBy === this.state.socketId

        if (lockedByActiveUser && lockedBy !== this.state.socketId) {
            const user = this.state.users.find(u => u.socketId === lockedBy)
            this._showLockTakenOverDialog(user)
        }

        this.extendState({
            lockedBy: lockedBy
        })

        this._setLockStatus(lockedBy)
    }

    _onVersionChange({savedBy}) {
        if (savedBy !== this.socket.id) {
            const user = this.state.users.find(u => u.socketId === savedBy)
            this.extendState({articleOutdated: true})
            this._showArticleOutdatedDialog(user)
        }

    }

    _setIsActiveUser(user) {
        user.isActiveUser = this.socket.id === user.socketId

        return user
    }

    _useUATracker() {
        return api.getConfigValue('se.infomaker.imidtracker', 'uatrackerHost', false)
    }

    _onDocumentChanged(change) {
        if (this._useUATracker()) {
            // If user is not logged in, do nothing
            if (!this.socket) {
                console.warn('Document changed before user logged in. This might indicate a problem with a plugin. Document change:', change)
                return
            }

            if (!this.state.lockedBy) {
                // Article is not locked by anyone, so we reserve it for active user
                this._reserveArticle()
            } else if (this.state.lockedBy !== this.socket.id) {
                // Article is locked by someone else
                this._showArticleLockedDialog()
            }
        }
    }

    _onDocumentSaved() {
        // On save, wheter we have locked the article or not, release the article lock
        // to let all other users know it has been updated.
        // Save should be disabled elsewhere if the article is not locked by us.
        this._releaseArticle()
    }

    _userLogin(user) {
        if (api.history.isAvailable()) {
            api.history.storage.setItem('user', JSON.stringify(user))
        }

        // Add timestamp to user (in order to render for how long
        // user has been on new article).
        user.timestamp = moment().format('x')

        this.extendState({
            users: [user]
        })

        this._login(user)
    }

    _login({email, name, picture}) {
        this.extendState({
            email: email,
            name: name,
            picture: picture
        })

        if (this._useUATracker()) {
            this._initUATracker()
        }
    }

    _logout() {
        if (api.history.isAvailable()) {
            api.history.storage.removeItem('user')
            this.socket.close()
        }

        this.extendState({
            email: null,
            name: null,
            socketId: null,
            users: []
        })

        api.user.logout()
    }

    _initUATracker() {
        const host = api.getConfigValue('se.infomaker.imidtracker', 'uatrackerHost', false)

        if (!host) {
            console.error('No configured UA-tracker host for plugin se.infomaker.imidtracker')
            return
        }

        this.socket = io(host)

        this.socket.on('error', (e) => {
            console.error('Socket error', e)
        })

        this.socket.on('connect', this._onConnect)
        this.socket.on('connect_error', this._onSocketConnectError)
        this.socket.on('article/user-change', this._onUserChange)
        this.socket.on('article/lock-status-change', this._onLockStatusChange)
        this.socket.on('article/version-change', this._onVersionChange)
    }

    _lockArticle() {
        api.events.userActionLock()
    }

    _unlockArticle() {
        api.events.userActionUnlock()
    }

    _setLockStatus(lockedBy) {
        if (lockedBy && lockedBy !== this.socket.id) {
            // Locked by other user
            this._lockArticle()
        } else if (lockedBy === this.socket.id) {
            // Locked by active user
            this._unlockArticle()
        } else {
            // Not locked
            if (!this.state.articleOutdated) {
                this._unlockArticle()
            }
        }
    }

    _showArticleOutdatedDialog(user) {
        const dialogProps = {
            message: this.getLabel('imidtracker-article-outdated-message')
                .replace('{{name}}', user.name)
                .replace('{{email}}', user.email),
            cbPrimary: () => window.location.reload()
        }
        const dialogOptions = {
            heading: this.getLabel('imidtracker-article-outdated-title'),
            primary: this.getLabel('reload-article'),
            secondary: this.getLabel('cancel'),
            center: false
        }

        api.ui.showDialog(Dialog, dialogProps, dialogOptions)
    }

    _showArticleLockedDialog() {
        const dialogProps = {
            message: this.getLabel('imidtracker-article-locked-message')
        }
        const dialogOptions = {
            heading: this.getLabel('imidtracker-article-locked-title'),
            primary: this.getLabel('confirm-understand'),
            secondary: false,
            center: false
        }

        api.ui.showDialog(Dialog, dialogProps, dialogOptions)
    }

    _showLockTakenOverDialog(user) {
        const dialogProps = {
            message: this.getLabel('imidtracker-article-taken-over-message')
                .replace('{{name}}', user.name)
                .replace('{{email}}', user.email)
        }
        const dialogOptions = {
            heading: this.getLabel('imidtracker-article-taken-over-title'),
            primary: this.getLabel('confirm-understand'),
            secondary: false,
            center: false
        }

        api.ui.showDialog(Dialog, dialogProps, dialogOptions)
    }

    _closeSocket() {
        if (this.socket) {
            this.socket.close()
        }
    }

    async _getAuthUser() {
        const user = await api.user.getUserInfo()

        return {
            email: user.email,
            name: `${user.given_name} ${user.family_name}`,
            picture: user.picture,
            isActiveUser: true
        }

    }
}

export default IMIDTracker

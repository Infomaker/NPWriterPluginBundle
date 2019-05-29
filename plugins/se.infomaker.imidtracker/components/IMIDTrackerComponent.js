'use strict'

import {Component} from 'substance'
import {api, moment, event} from 'writer'
import io from 'socket.io-client'

import {IMIDDialogComponent} from './IMIDDialogComponent'
import {UserListComponent} from './UserListComponent'
import {LockButtonBarItem} from './LockButtonBarItem'
import {NoConnectionBarItem} from './NoConnectionBarItem'

const pluginId = 'se.infomaker.imidtracker'

class IMIDTrackerComponent extends Component {

    constructor(...args) {
        super(...args)

        this._onConnect = this._onConnect.bind(this)
        this._onSocketConnectError = this._onSocketConnectError.bind(this)
        this._onUserChange = this._onUserChange.bind(this)
        this._onLockStatusChange = this._onLockStatusChange.bind(this)
        this._onVersionChange = this._onVersionChange.bind(this)
        this._setIsActiveUser = this._setIsActiveUser.bind(this)
        this._userLogin = this._userLogin.bind(this)
        this._onDocumentChanged = this._onDocumentChanged.bind(this)
        this._onDocumentSaved = this._onDocumentSaved.bind(this)
        this._handleUserChange = this._handleUserChange.bind(this)
        this._startSessionPolling = this._startSessionPolling.bind(this)

        this._onDocumentCreated = this._onDocumentCreated.bind(this)
        this._reconnectSocket = this._reconnectSocket.bind(this)
    }

    /**
     * Functionality to handle if user session expires and
     * a new session is created with a new user sub
     * eg if a different user signs in mid. operation
     */
    async _handleUserChange(event) {
        const userInfo = event.data
        userInfo.name = `${userInfo.given_name} ${userInfo.family_name}`
        userInfo.isActiveUser = true

        if (userInfo.sub !== this.state.sub) {
            const shouldLockArticle = this.state.lockedBy && this.socket && this.state.lockedBy === this.socket.id

            await this._reconnectSocket(userInfo)

            if (shouldLockArticle) {
                this._lockArticle()
            }
        }
    }

    dispose() {
        api.events.off(pluginId, event.DOCUMENT_CHANGED)
        api.events.off(pluginId, event.DOCUMENT_SAVED)
        api.events.off(pluginId, event.DID_LOGIN)
        this._closeSocket()

        if (this.pollInterval) {
            clearInterval(this.pollInterval)
        }
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
        api.events.on(pluginId, event.DOCUMENT_CHANGED, this._onDocumentChanged)
        api.events.on(pluginId, event.DOCUMENT_SAVED, this._onDocumentSaved)
        api.events.on(pluginId, event.DID_LOGIN, this._handleUserChange)
        // api.events.on(pluginId, event.DID_LOGIN, this._startSessionPolling)

        api.events.on(pluginId, event.DOCUMENT_CREATED, this._onDocumentCreated)

        // Listen to Document copied event and re-render application components
        api.events.on(pluginId, event.DOCUMENT_COPIED, async () => {
            await this._reconnectSocket()
        })

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

        this._startSessionPolling()
    }

    /**
     * Close socket connection and reconnect with supplied userInfo
     * or logged in user
     *
     * @param userInfo
     * @returns {Promise<void>}
     * @private
     */
    async _reconnectSocket(userInfo = null) {
        this._closeSocket()

        if(!userInfo) {
            userInfo = await this._getAuthUser()
        }

        await this.setState(
            this.getInitialState()
        )

        await this._userLogin(userInfo)
    }

    /**
     * Reinitialize UA-tracker socket connection
     * when article is saved for the first time
     *
     * @private
     */
    _onDocumentCreated() {
        if (this._useUATracker()) {
            this._initUATracker()
        }
    }

    _startSessionPolling() {
        // Start polling IMSG to ensure we have active session
        const interval = api.getConfigValue('se.infomaker.imidtracker', 'sessionPollIntervalMilliseconds', 5000)
        const pollEndpoint = api.getConfigValue('se.infomaker.imidtracker', 'sessionPollEndpoint', '/imsg-service/v1/token-is-set')

        this.pollInterval = setInterval(() => {
            api.router.get(pollEndpoint)
                .then(async response => {
                    if (response.ok) {
                        const json = await response.json()

                        if (json.statusCode === 404) {
                            clearInterval(this.pollInterval)
                            console.info(`Old version of IMSG without token-check support: ${json.message}`)
                            console.info('--- Exiting session checker')
                        }
                        else {
                            // All is well
                        }

                    }
                    else {

                        // If response is unauthorized we fetch a writer resource, this will trigger login
                        // This is because IMSG does not have any knowledge about ORG or loginURL, only SAL does
                        // We stop the interval awaiting completed login, then start it again
                        if (response.status === 401) {
                            clearInterval(this.pollInterval)
                            api.router.get('/').then(() => this._startSessionPolling())
                        }
                        throw Error(`Unauthorized`)
                    }
                })
                .catch(error => console.warn(`Whoops, no valid session: ${error.message}`))
        }, interval)
    }

    render($$) {
        const el = $$('div')
        const container = $$('div')
            .addClass('sc-np-bar-container imidtracker')

        if (this.state.socketError) {
            container.append($$(NoConnectionBarItem).ref('no-connection'))
        }
        else if (this.state.users.length) {
            // Show user list if there are users
            const userListElem = $$(UserListComponent, {
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
            }).ref('imid-lock-button')

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

            // Only unlock article if user has socket (and socketId)
            if (this.socket && this._articleInformation.socketId) {
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

        if (lockedBy && lockedByActiveUser && lockedBy !== this.state.socketId) {
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
            }
            else if (this.state.lockedBy !== this.socket.id) {
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

        // Only set user as logged in if article is new or unsaved
        // If the article has an id, users will be fetched by UATracker
        if (!api.newsItem.getGuid()) {
            this.extendState({
                users: [user]
            })
        }

        this._login(user)
    }

    _login({email, name, picture, sub}) {
        this.extendState({
            email,
            name,
            picture,
            sub
        })

        if (this._useUATracker()) {
            this._initUATracker()
        }
    }

    _logout() {
        const doLogout = () => {
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

        if(this.context.state.document.changed) {
            api.events.trigger(null, event.DISABLE_UNLOAD_WARNING, {})

            api.ui.showConfirmDialog(
                this.getLabel('Are you sure you want to log out?'),
                this.getLabel('The article contains unsaved changes, are you sure you want to log out?'),
                {
                    primary: {
                        label: this.getLabel('Ja'),
                        callback: doLogout
                    },
                    secondary: {
                        label: this.getLabel('Nej'),
                        callback: () => {
                            api.events.trigger(null, event.ENABLE_UNLOAD_WARNING, {})
                        }
                    }
                }
            )
        } else {
            doLogout()
        }
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
        api.events.trigger(null, event.USERACTION_LOCK)
    }

    _unlockArticle() {
        api.events.trigger(null, event.USERACTION_UNLOCK)
    }

    _setLockStatus(lockedBy) {
        if (lockedBy && lockedBy !== this.socket.id) {
            // Locked by other user
            this._lockArticle()
        }
        else if (lockedBy === this.socket.id) {
            // Locked by active user
            this._unlockArticle()
        }
        else {
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

        api.ui.showDialog(IMIDDialogComponent, dialogProps, dialogOptions)
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

        api.ui.showDialog(IMIDDialogComponent, dialogProps, dialogOptions)
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

        api.ui.showDialog(IMIDDialogComponent, dialogProps, dialogOptions)
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
            isActiveUser: true,
            sub: user.sub
        }

    }
}

export {IMIDTrackerComponent}

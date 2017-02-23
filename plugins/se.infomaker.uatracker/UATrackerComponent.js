//http://dev.lca.infomaker.io/

import io from 'socket.io-client'
import {Component} from 'substance'
import { api, moment} from 'writer'
import LoginComponent from './LoginComponent'
import NoConnection from './NoConnection'
import UserList from './UserList'

class UATrackerComponent extends Component {

    constructor(...args) {
        super(...args)


    }

    getInitialState() {
        return {
            username: null,
            email: null,
            users: []
        }
    }


    didMount() {
        // If no username specified make sure to show dialog

        this.showLogin()

    }

    showLogin() {
        if (api.history.isAvailable()) {
            const user = api.history.storage.getItem('user')
            if (user) {
                this.login(JSON.parse(user))
            } else {
                api.ui.showDialog(LoginComponent, {login: this.userLogin.bind(this)}, {
                    title: "Logga in",
                    primary: this.getLabel('Continue'),
                    secondary: false,
                    disableEscKey: true
                })
            }
        }
    }


    socketConnectError() {
        console.log("Error");
        this.props.popover.setIcon('fa-chain-broken')
        this.props.popover.setStatusText(this.getLabel('uatracker-no-connetion'))
        this.extendState({
            users: [],
            socketId: null,
            socketError: true
        })
    }
    setupLiveArticles() {

        const uuid = api.newsItem.getGuid()
        const customerKey = api.getConfigValue('se.infomaker.uatracker', 'customerKey')
        const host = api.getConfigValue('se.infomaker.uatracker', 'host')

        this.socket = io(host)

        this.socket.on('connect_error', this.socketConnectError.bind(this))

        this.socket.on('error', () => {
            // Handle error
        })

        this.socket.on('connect', () => {
            console.log("Connected");
            this.updateIcon([])
            this.extendState({
                socketError: false
            })

            /*
             Trigger an event telling the server that we have opened this article
             */
            const information = {
                uuid: uuid,
                timestamp: moment().format('x'),
                socketId: this.socket.id,
                customerKey: customerKey,
                name: this.state.name,
                email: this.state.email
            }

            this.socket.emit('article/opened', information)


            this.socket.on('article/user-change', (users) => {
                this.extendState({
                    users: users,
                    socketId: this.socket.id
                })
                this.updateIcon(users)
            })
        })


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

    dispose() {
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
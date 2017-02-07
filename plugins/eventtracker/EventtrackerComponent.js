//http://dev.lca.infomaker.io/

import io from 'socket.io-client'
import {Component} from 'substance'
import {idGenerator, api, moment} from 'writer'
import LoginComponent from './LoginComponent'

class EventtrackerComponent extends Component {

    constructor(...args) {
        super(...args)


    }

    getInitialState() {
        return {
            username: null,
            users: []
        }
    }


    didMount() {
        // If no username specified make sure to show dialog


        if (!this.state.username) {
            api.ui.showDialog(LoginComponent, {login: this.login.bind(this)}, {
                title: "Logga in",
                primary: false,
                secondary: false
            })
        }
    }

    setupLiveArticles() {

        const uuid = api.newsItem.getGuid()
        const eventPrefix = api.getConfigValue('se.infomaker.eventtracker', 'customerKey')

        const username = JSON.stringify({username: this.state.username, userId: idGenerator()})

        const socket = io('http://localhost:3000')

        socket.on('connect', (data) => {
            console.log("Client connect", data);
        })


    }

    dispose() {
    }

    login(name) {
        this.extendState({
            username: name
        })
        this.setupLiveArticles()
    }

    render($$) {

        const el = $$('div').addClass('eventtracker')
        el.append($$('h2').append('Användare som har denna artikel öppen'))


        return el
    }
}

export default EventtrackerComponent
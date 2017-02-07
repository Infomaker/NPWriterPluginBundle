//http://dev.lca.infomaker.io/

import deepStreamClient from 'deepstream.io-client-js'
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
        if(!this.state.username) {
            api.ui.showDialog(LoginComponent, { login: this.login.bind(this)}, { title: "Logga in" })
        }
    }

    setupLiveArticles() {

        const uuid = api.newsItem.getGuid()
        const eventPrefix = api.getConfigValue('se.infomaker.eventtracker', 'customerKey')

        const client = deepStreamClient('localhost:6020').login({username: this.state.username}, (success, data) => {
            console.log("Log in", data);

            if(success) {
                client.event.emit('user/logged-in', {username: this.state.username, id: client.getUid()})

                client.event.subscribe('user/logged-in', (eventName, isSubscribed, response) => {
                    console.log("User logged in", eventName, isSubscribed);
                })
            }

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
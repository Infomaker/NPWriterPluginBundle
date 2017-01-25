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

        if(!this.state.username) {
            // const dialog = $$(LoginComponent)
            api.ui.showDialog(
                LoginComponent,
                {
                    login: this.login.bind(this)
                },
                {
                    title: "Logga in",
                }
            );
        }

        this.identifier = idGenerator()
        this.socket = io('http://dev.lca.infomaker.io');


        this.socket.on('connect', () => {
            console.log("LiveApi.WS: Connected to websocket AP!");
        })

        this.socket.on('disconnect', function () {
            if (this.log) {
                console.log("LiveApi.WS: No longer connected to websocket AP!");
            }
            // backend has canceled all our sessions, so clear the callback array
            this.callbacks = [];
        }.bind(this));

        this.socket.on('event', (msg) => {

            if(msg.customId === this.identifier) {
                const payload = msg.payload
                if(payload.action === 'streamNotify') {
                    const data = JSON.parse(payload.data.result)
                    if(data.eventtype === 'UPDATE') {
                        // api.router.getNewsItem(data.uuid, 'x-im/article')
                        //     .then(xml => {
                        //         console.log("xml", xml);
                        //     })
                        api.ui.showNotification('Eventtracker', 'Artikeln är uppdaterad', 'Någon verkar ha uppdaterat denna artikel')
                    }
                }

                console.log("Event is not coming from this", msg);
            }
        });

        const query = {
            query: {
                "bool": {
                    "must": {
                        match: {
                            uuid: 'afc49a0d-564e-48d4-b7ed-1b38086a8a5c'
                        }
                    }
                }
            }
        }

        const data = {
            action: 'streamCreate',
            version: 1,
            accessConf: {
                contentProvider: {
                    id: 'devWriterStream',
                },
                auth: {}
            },
            data: query
        }
        const params = {
            customId: this.identifier,
            payload: {
                action: data.action,
                contentProvider: data.accessConf.contentProvider,
                auth: data.accessConf.auth,
                version: data.version || 1,
                data: data.data
            }
        }
        this.socket.emit('event', params)
    }

    setup() {
        this.socketWriter = io('http://localhost:3000');

        this.callbacks = []

        this.socketWriter.on('connect', () => {
            console.log("WriterSocker");

            this.socketWriter.emit('article-opened', {
                user: this.state.username,
                uuid:writer.api.newsItem.getGuid(),
                timestamp: moment().format('x')
            })
        })
        this.socketWriter.on('message', (msg) => {
            console.log("Message", msg);
        })

        this.socketWriter.on('user-disconnected', (user)=> {
            console.log("user disconnected", user);
        })

        this.socketWriter.on('user-connected', (user)=> {
            console.log("User connected", user);
        })
        this.socketWriter.on('all-users', (users)=> {
            users.users.forEach((user) => {
                console.log("User:", user.username);
            })

            this.extendState({
                users:users.users
            })
        })


    }

    dispose() {
        this.socketWriter = null
    }

    login(name) {
        this.extendState({
            username: name
        })
    }
    render($$) {



        const el = $$('div').addClass('eventtracker')
        el.append($$('h2').append('Användare som har denna artikel öppen'))

        if(this.state.username) {
            if(!this.socketWriter) {
                this.setup()
            }
            const allUsers = $$('ul')

            const userList = this.state.users.map((user) => {

                const item = $$('li')
                const username = $$('span').addClass('username').append(user.username)
                const timestamp = $$('span').addClass('timestamp').append('Loggade in: ' + moment(parseInt(user.timestamp, 10)).fromNow())
                if(this.state.username === user.username) {
                    item.addClass('current')
                }

                item.append([username, timestamp])
                return item
            })
            allUsers.append(userList)

            el.append([allUsers])
        } else {


        }

        return el
    }
}

export default EventtrackerComponent
import {infocaster} from 'writer'

class InfocasterIntegration {
    constructor({uuid, callback, token}) {
        const infoCasterClient = new infocaster.WebSocketClient('https://infocaster-stage.lcc.infomaker.io', token);

        infoCasterClient.on('sessionInit', (data) => {
            this.sessionInit = data
            infoCasterClient.subscribe(uuid)
        })

        infoCasterClient.on('broadcastPublish', (event) => {
            callback(event.payload)
        })
    }
}

export {InfocasterIntegration}

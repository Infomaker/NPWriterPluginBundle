import {infocaster} from 'writer'

class InfocasterIntegration {
    constructor({uuid, callback}) {
        const infoCasterClient = new infocaster.WebSocketClient('https://infocaster-stage.lcc.infomaker.io');

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

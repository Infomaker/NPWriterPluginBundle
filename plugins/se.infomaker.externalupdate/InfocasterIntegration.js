import { infocaster } from 'writer'

class InfocasterIntegration {
    constructor({ uuid, callback, token, publisherId, infocasterHost }) {
        const infoCasterClient = new infocaster.WebSocketClient(infocasterHost, token, publisherId);

        infoCasterClient.on('sessionInit', (data) => {
            this.sessionInit = data
            infoCasterClient.subscribe(uuid, publisherId)
        })

        infoCasterClient.on('broadcastPublish', (event) => {
            callback(event.payload)
        })
    }
}

export { InfocasterIntegration }

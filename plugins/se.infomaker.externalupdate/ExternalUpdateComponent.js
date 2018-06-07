import {Component} from 'substance'
import {api, event, infocaster} from 'writer'
import {UpdateMessageHandler} from "./UpdateMessageHandler";
import {InfocasterIntegration} from "./InfocasterIntegration";


class ExternalUpdateComponent extends Component {

    constructor(...args) {
        super(...args)

        if (!api.newsItem.hasTemporaryId()) {

            const messageHandler = new UpdateMessageHandler(api, {
                externalChangeTitle: this.getLabel('externalChangeTitle'),
                externalChangeSomeone: this.getLabel('externalChangeSomeone'),
                externalChangeMessage: this.getLabel('externalChangeMessage'),
                messageFailed: this.getLabel('messageFailed'),
                messageFailedReason: this.getLabel('messageFailedReason')
            })

            new InfocasterIntegration({
                uuid: api.newsItem.getGuid(),
                callback: (data) => {
                    messageHandler.handleMessage(data)
                },
                token: this.props.pluginConfigObject.pluginConfigObject.data.token
            })
        }
    }

    didMount() {
        api.events.on('ExternalUpdateComponent', 'external:updated', (e) => {
            console.log(e)
        })
    }

    dispose(...args) {
        super.dispose(...args)

        api.events.off('ExternalUpdateComponent', 'external:updated')
    }

    render($$) {

        return $$('div').ref('externalUpdateContainer')

    }
}

export {ExternalUpdateComponent}

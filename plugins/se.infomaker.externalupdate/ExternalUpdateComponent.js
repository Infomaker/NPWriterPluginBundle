import {Component} from 'substance'
import {api, event, infocaster} from 'writer'
import {UpdateMessageHandler} from "./UpdateMessageHandler";
import {InfocasterIntegration} from "./InfocasterIntegration";


class ExternalUpdateComponent extends Component {

    constructor(...args) {
        super(...args)

        if (!api.newsItem.hasTemporaryId()) {
            this.messageHandler = new UpdateMessageHandler(api, {
                externalChangeTitle: this.getLabel('externalChangeTitle'),
                externalChangeSomeone: this.getLabel('externalChangeSomeone'),
                externalChangeMessage: this.getLabel('externalChangeMessage')
            }) // TODO const instead of this
            new InfocasterIntegration({
                uuid: api.newsItem.getGuid(),
                callback: (data) => {
                    this.messageHandler.handleMessage(data)
                }
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
        const Button = this.getComponent('button')
        const Tooltip = this.getComponent('tooltip')

        let message = ""

        return $$('div').ref('externalUpdateContainer').append(
            [
                $$('textarea').on('change', (evt) => {
                    message = evt.target.value
                }).ref('messageInput'),
                $$('a')
                    .setAttribute('href', '#')
                    .append('click me')
                    .on('click', (e) => {
                        e.preventDefault()
                        this.messageHandler.handleMessage(JSON.parse(message))
                        this.refs.messageInput.val("")
                        return false
                    })
            ]
        )

    }
}

export {ExternalUpdateComponent}

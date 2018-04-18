import {Component} from 'substance'
import {api, event} from 'writer'
import {UpdateMessageHandler} from "./UpdateMessageHandler";


class ExternalUpdateComponent extends Component {

    constructor(...args) {
        super(...args)

        this.messageHandler = new UpdateMessageHandler(api)
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
                $$('h2').append('*** External Update ***'),
                $$('textarea').on('change', (evt) => {message = evt.target.value}).ref('messageInput'),
                $$(Button, {
                    icon: 'open-link',
                    style: this.props.style
                })
                    .addClass('edit-link-btn visit')
                    .append($$(Tooltip, {title: this.getLabel('open-link')}).ref('tooltipOpenLink'))
                    .on('click', () => {
                        this.messageHandler.handleMessage(JSON.parse(message))
                        this.refs.messageInput.val("")
                    })
                    .on('mouseover', () => {
                        this.refs.tooltipOpenLink.extendProps({
                            show: true
                        })
                    })
                    .on('mouseout', () => {
                        this.refs.tooltipOpenLink.extendProps({
                            show: false
                        })
                    })
            ]
        )

    }


    handleExternalUpdateMessage(message) {

    }

}

export {ExternalUpdateComponent}

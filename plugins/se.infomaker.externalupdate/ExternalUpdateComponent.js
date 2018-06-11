import {Component} from 'substance'
import {api, event, infocaster} from 'writer'
import {UpdateMessageHandler} from "./UpdateMessageHandler";
import {InfocasterIntegration} from "./InfocasterIntegration";


class ExternalUpdateComponent extends Component {

    constructor(...args) {
        super(...args)

        if (!api.newsItem.hasTemporaryId()) {

            const messageHandler = new UpdateMessageHandler(api.article, {
                failed: (message, e) => {
                    api.ui.showMessageDialog(
                        [
                            {
                                type: 'error',
                                message: `${this.getLabel('messageFailed')} ${this.getLabel('messageFailedReason')}: ${e.message}`
                            }
                        ],
                        () => {
                        },
                        () => {
                        })
                },
                applied: (message) => {
                    if (message.changedBy) {
                        const title = this.getLabel('externalChangeTitle')
                        const name = message.changedBy.name || ''
                        const email = message.changedBy.email || this.getLabel('externalChangeSomeone')
                        const body = message.changedBy.message || this.getLabel('externalChangeMessage')
                        api.ui.showNotification(
                            'se.infomaker.externalupdate',
                            title,
                            `${body} -- ${name} (${email})`,
                            true)
                    } else {
                        api.ui.showNotification(
                            'se.infomaker.externalupdate',
                            this.getLabel('externalChangeTitle'),
                            this.getLabel('externalChangeMessage'),
                            true)
                    }

                }
            })

            new InfocasterIntegration({
                uuid: api.newsItem.getGuid(),
                callback: (data) => {
                    messageHandler.handleMessage(data)
                },
                token: this.props.pluginConfigObject.pluginConfigObject.data.token,
                publisherId: this.props.pluginConfigObject.pluginConfigObject.data.publisherId
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

    notifyMessageFailed(message, e) {
    }

    notifyMessageApplied(message) {

    }


    render($$) {

        return $$('div').ref('externalUpdateContainer')

    }
}

export {ExternalUpdateComponent}

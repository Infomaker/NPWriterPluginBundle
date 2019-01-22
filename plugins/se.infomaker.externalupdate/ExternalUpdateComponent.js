import { Component } from 'substance'
import { api } from 'writer'
import { UpdateMessageHandler } from "./UpdateMessageHandler";
import { InfocasterIntegration } from "./InfocasterIntegration";


class ExternalUpdateComponent extends Component {

    constructor(...args) {
        super(...args)

        if (this._validatePluginConfig() && !api.newsItem.hasTemporaryId()) {

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
                token: this._getConfigValue('token'),
                publisherId: this._getConfigValue('publisherId'),
                infocasterHost: this._getConfigValue('infocasterHost')
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

    _getConfigValue(key) {
        return api.getConfigValue('se.infomaker.externalupdate', key)
    }

    _validatePluginConfig() {
        const token = this._getConfigValue('token')
        if (!token) {
            console.error('Invalid config for se.infomaker.externalupdate. Missing token')
        }

        const publisherId = this._getConfigValue('publisherId')
        if (!publisherId) {
            console.error('Invalid config for se.infomaker.externalupdate. Missing publisherId')
        }

        const infocasterHost = this._getConfigValue('infocasterHost')
        if (!infocasterHost) {
            console.error('Invalid config for se.infomaker.externalupdate. Missing infocasterHost')
        }

        if (!token || !publisherId || !infocasterHost) {
            setTimeout(() => {
                this.context.api.ui.showNotification('externalupdate', 'Invalid External Update Configuration', 'Invalid config for se.infomaker.externalupdate')
            }, 0)
            return false
        }

        return true
    }
}

export { ExternalUpdateComponent }

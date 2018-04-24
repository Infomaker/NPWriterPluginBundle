import { Component } from 'substance'
import { api, event, ConceptService } from 'writer'
import SelectMainChannelComponent from './SelectMainChannelComponent'
import ChannelsComponent from './ChannelsComponent'

class PublicationChannelComponent extends Component {

    constructor(...args) {
        super(...args)

        this.addChannelToArticle = this.addChannelToArticle.bind(this)
        this.updateArticleChannelRel = this.updateArticleChannelRel.bind(this)
        this.removeChannelFromArticle = this.removeChannelFromArticle.bind(this)
        this.selectAll = this.selectAll.bind(this)
        this.removeAll = this.removeAll.bind(this)
    }

    async didMount() {
        api.events.on(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED, event => {
            const eventName = (event.name || '').replace('-', '').replace('/', '')
            const conceptType = this.state.conceptType.replace('-', '').replace('/', '')

            if (eventName === conceptType) {
                this.loadArticleConcepts()
            }
        })

        this.loadArticleConcepts()
    }

    dispose() {
        api.events.off(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED)
    }

    async loadArticleConcepts() {
        const channels = await ConceptService.getRemoteConceptsByType(this.state.conceptType)
        const articleChannels = ConceptService.getArticleConceptsByType(this.state.conceptType)
        const articleMainChannel = articleChannels.find(articleChannel => articleChannel.rel === 'mainchannel')
        const mainChannel = articleMainChannel ? channels.find(channel => channel.uuid === articleMainChannel.uuid) : null

        this.extendState({
            mainChannel,
            channels,
            articleChannels
        })
    }

    confirmAndRemoveItems(channels) {
        const { propertyMap } = this.state
        const itemsString = Array.isArray(channels) ? channels.reduce((iterator, item) => {
            return `${iterator}${iterator.length ? ', ' : ''}${item[propertyMap.ConceptName]}`
        }, '') : channels.ConceptName

        api.ui.showConfirmDialog(
            this.getLabel('Related concepts will be affected'),
            `${this.getLabel('There are concepts associated with the one you removed, do you wish to remove the following concepts as well')}: ${itemsString}`,
            {
                primary: {
                    label: this.getLabel('ok'),
                    callback: () => {
                        if (Array.isArray(channels)) {
                            channels.forEach(channel => ConceptService.removeArticleConceptItem(channel))
                        } else {
                            ConceptService.removeArticleConceptItem(channels)
                        }
                    }
                },
                secondary: {
                    label: this.getLabel('cancel'),
                    callback: () => { }
                }
            }
        )
    }

    getInitialState() {
        const pluginConfig = this.props.pluginConfigObject.pluginConfigObject.data
        const conceptType = 'x-im/channel'
        const propertyMap = ConceptService.getPropertyMap()

        return {
            pluginConfig,
            conceptType,
            propertyMap,
            channels: [],
            articleChannels: []
        }
    }

    addChannelToArticle(channel) {
        ConceptService.addArticleConcept(channel)
    }

    updateArticleChannelRel(channel) {
        ConceptService.updateArticleChannelRel(channel)
    }

    removeChannelFromArticle(channel) {
        this.confirmAndRemoveItems(channel)
    }

    selectAll() {
        this.state.channels.forEach(channel => {
            const match = this.state.articleChannels.find(articleChannel => articleChannel.uuid === channel.uuid)
            if (!match) {
                this.addChannelToArticle(channel)
            }
        })
    }

    removeAll() {
        this.confirmAndRemoveItems(this.state.articleChannels)
    }

    render($$){
        return $$('div', { class: 'publication-main-component' }, [
            $$('h2', {}, this.getLabel('Publication channels')).ref('channel-label'),

            this.state.pluginConfig.disableMainChannel ? '' : $$(SelectMainChannelComponent, {
                ...this.state,
                addChannelToArticle: this.addChannelToArticle,
                updateArticleChannelRel: this.updateArticleChannelRel,
                removeChannelFromArticle: this.removeChannelFromArticle
            }).ref('mainChannelComponent'),

            $$(ChannelsComponent, {
                ...this.state,
                disableMainChannel: this.state.pluginConfig.disableMainChannel,
                addChannelToArticle: this.addChannelToArticle,
                removeChannelFromArticle: this.removeChannelFromArticle,
                selectAll: this.selectAll,
                removeAll: this.removeAll
            }).ref('channelsComponent')
        ]).ref('publicationChannelMainComponent')
    }

}

export default PublicationChannelComponent

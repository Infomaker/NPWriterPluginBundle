import { Component } from 'substance'
import { api, event, ConceptService } from 'writer'
import MainChannelComponent from './MainChannelComponent'
import ChannelsComponent from './ChannelsComponent'

class PublicationChannelMainComponent extends Component {

    constructor(...args) {
        super(...args)

        this.addChannelToArticle = this.addChannelToArticle.bind(this)
        this.updateArticleChannelRel = this.updateArticleChannelRel.bind(this)
        this.removeChannelFromArticle = this.removeChannelFromArticle.bind(this)
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
        this.extendState({
            channels: await ConceptService.getRemoteConceptsByType(this.state.conceptType),
            articleChannels: ConceptService.getArticleConceptsByType(this.state.conceptType)
        })
    }

    getInitialState() {
        const pluginConfig = this.props.pluginConfigObject.pluginConfigObject.data
        const conceptType = pluginConfig.conceptType || 'x-im/channel'
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
        ConceptService.removeArticleConceptItem(channel)
    }

    render($$){
        return $$('div', { class: 'publication-main-component' }, [
            $$('h2', {}, this.getLabel('publication-channel-title')).ref('channel-label'),

            this.state.pluginConfig.disableMainChannel ? '' : $$(MainChannelComponent, {
                ...this.state,
                addChannelToArticle: this.addChannelToArticle,
                updateArticleChannelRel: this.updateArticleChannelRel,
                removeChannelFromArticle: this.removeChannelFromArticle
            }).ref('mainChannelComponent'),

            $$(ChannelsComponent, {
                ...this.state,
                addChannelToArticle: this.addChannelToArticle,
                removeChannelFromArticle: this.removeChannelFromArticle
            }).ref('channelsComponent')
        ]).ref('publicationChannelMainComponent')
    }

}

export default PublicationChannelMainComponent
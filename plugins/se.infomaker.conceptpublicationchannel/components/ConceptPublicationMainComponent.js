import { Component } from 'substance'
import { api, event, ConceptService } from 'writer'
import MainChannelComponent from './MainChannelComponent'
import ChannelsComponent from './ChannelsComponent'

class ConceptPublicationMainComponent extends Component {

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
        this.extendState({
            channels,
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
        console.info('ConceptPublication::addChannelToArticle', channel)
        ConceptService.addArticleConcept(channel)
    }

    updateArticleChannelRel(channel) {
        console.info('ConceptPublication::updateArticleChannelRel')
        ConceptService.updateArticleChannelRel(channel)
    }

    removeChannelFromArticle(channel) {
        console.info('ConceptPublication::removeChannelFromArticle')
        ConceptService.removeArticleConceptItem(channel)
    }

    render($$){
        return $$('div', { class: 'publication-main-component' }, [
            $$('h2', {}, this.getLabel('publication-channel-title')).ref('channel-label'),

            $$(MainChannelComponent, {
                ...this.state,
                addChannelToArticle: this.addChannelToArticle.bind(this),
                updateArticleChannelRel: this.updateArticleChannelRel.bind(this),
                removeChannelFromArticle: this.removeChannelFromArticle.bind(this)
            }).ref('mainChannelComponent'),

            $$(ChannelsComponent, {
                ...this.state,
                addChannelToArticle: this.addChannelToArticle.bind(this),
                removeChannelFromArticle: this.removeChannelFromArticle.bind(this)
            }).ref('channelsComponent')
        ]).ref('conceptPublicationMainComponent')
    }

}

export default ConceptPublicationMainComponent
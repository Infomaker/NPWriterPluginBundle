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

    didMount() {
        api.events.on(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED, e => {
            const eventName = (e.name || '').replace('-', '').replace('/', '')
            const conceptType = this.state.conceptType.replace('-', '').replace('/', '')

            if (eventName.length && eventName === conceptType) {
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

    checkForAssociatedConceptsInArticle(channel, associatedConceptsInArticle) {
        const { propertyMap } = this.state
        if (channel[propertyMap.ConceptAssociatedWithMeRelations] && channel[propertyMap.ConceptAssociatedWithMeRelations].length) {
            channel[propertyMap.ConceptAssociatedWithMeRelations].forEach(associatedConcept => {
                const articleConcept = ConceptService.getArticleConceptByUUID(associatedConcept.uuid)
                if (articleConcept) {
                    associatedConceptsInArticle.push(articleConcept)
                }
            })
        }
    }

    confirmAndRemoveItems(channel) {
        const associatedConceptsInArticle = []

        if (channel) {
            if (Array.isArray(channel)) {
                channel.forEach(channelInstans => this.checkForAssociatedConceptsInArticle(channelInstans, associatedConceptsInArticle))
            } else {
                this.checkForAssociatedConceptsInArticle(channel, associatedConceptsInArticle)
            }
        }

        if (associatedConceptsInArticle.length) {
            const conceptNameString = associatedConceptsInArticle.reduce((string, concept) => {
                return `${string}${string.length ? ', ' : ''}${concept.title}`
            }, '')

            api.ui.showConfirmDialog(
                this.getLabel('Related concepts might be affected'),
                `${this.getLabel('There are concepts associated with the one you are about to remove, these concepts might be removed as well')}: ${conceptNameString}`,
                {
                    primary: {
                        label: this.getLabel('ok'),
                        callback: () => {
                            if (Array.isArray(channel)) {
                                ConceptService.removeAllArticleLinksOfType(this.state.conceptType)
                            } else {
                                ConceptService.removeArticleConceptItem(channel)
                            }
                        }
                    },
                    secondary: {
                        label: this.getLabel('cancel'),
                        callback: () => { }
                    }
                }
            )
        } else {
            if (Array.isArray(channel)) {
                ConceptService.removeAllArticleLinksOfType(this.state.conceptType)
            } else {
                ConceptService.removeArticleConceptItem(channel)
            }
        }
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
        this.confirmAndRemoveItems(this.state.channels)
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

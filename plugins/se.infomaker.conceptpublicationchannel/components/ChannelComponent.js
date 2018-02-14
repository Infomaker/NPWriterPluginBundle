import { Component } from 'substance'
import { ConceptService } from 'writer'
import ChannelIconComponent from './ChannelIconComponent'

class ChannelComponent extends Component {

    async willReceiveProps(newProps) {
        let { channel, propertyMap } = newProps

        if (channel) {
            channel = await ConceptService.fetchConceptItemProperties(channel)

            // TODO: Fix this in ConceptService which is now dependant on the exiatance of name, type, rel
            channel.name = channel[propertyMap.ConceptName]
            channel.type = channel[propertyMap.ConceptImTypeFull]

            this.extendState({ channel })
        }
    }

    shouldRerender(newProps) {
        const isSelected = this.isSelected(newProps.articleChannels, newProps.channel)
        const shouldRerender = (isSelected !== this.state.selected)
        console.info('shouldRerender: ', shouldRerender)
        return shouldRerender
    }

    isSelected(articleChannels, channel) {
        return articleChannels.find(articleChannel => {
            return articleChannel.uuid === channel.uuid
        })
    }

    getInitialState() {
        const { channel, propertyMap, articleChannels } = this.props
        const selected = this.isSelected(articleChannels, channel)

        return {
            channel,
            articleChannels,
            propertyMap,
            selected
        }
    }

    render($$){
        const { channel, propertyMap, selected } = this.state

        return $$('div',{ class: `channel-component ${selected ? 'selected' : ''}` }, [
            $$(ChannelIconComponent, { ...this.props }).ref(`channelIconComponent-${channel.uuid}`),
            $$('div', { class: 'channel-text-wrapper' }, channel[propertyMap.ConceptName]),
            $$('i', { class: `channel-icon fa ${selected ? 'fa-check-square-o' : 'fa-square-o'}` }).ref(`channelIconComponent-${channel.uuid}-icon`)
        ])
        .on('click', () => {
            return selected ?
                this.props.removeChannelFromArticle(channel) :
                this.props.addChannelToArticle(channel)
        })
    }

}

export default ChannelComponent
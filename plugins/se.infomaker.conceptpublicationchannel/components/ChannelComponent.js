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

    getInitialState() {
        return {
            channel: this.props.channel,
            articleChannels: this.props.articleChannels,
            propertyMap: this.props.propertyMap
        }
    }

    render($$){
        const { channel, propertyMap, articleChannels } = this.state
        const selected = articleChannels.find( articleChannel => {
            return articleChannel.uuid === channel.uuid
        })

        return $$('div',{ class: `channel-component ${selected ? 'selected' : ''}` }, [
            $$(ChannelIconComponent, { ...this.props }).ref(`channelIconComponent-${channel.uuid}`),
            $$('div', { class: 'channel-text-wrapper' }, channel[propertyMap.ConceptName]),
            $$('i', { class: `channel-icon fa ${selected ? 'fa-checked-square-o' : 'fa-square-o'}` })
        ])
        .ref(`channelComponent-instance-${channel.uuid}`)
        .on('click', () => {
            return selected ?
                this.props.removeChannelFromArticle(channel) :
                this.props.addChannelToArticle(channel)
        })
    }

}

export default ChannelComponent
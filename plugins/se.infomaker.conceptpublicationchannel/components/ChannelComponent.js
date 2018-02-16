import { Component } from 'substance'
import { ConceptService } from 'writer'
import ChannelIconComponent from './ChannelIconComponent'

class ChannelComponent extends Component {

    async willReceiveProps(newProps) {
        let { channel, propertyMap, articleChannels } = newProps

        if (channel) {
            channel = await ConceptService.fetchConceptItemProperties(channel)
            const selected = this.isSelected(articleChannels, channel)

            // TODO: Fix this in ConceptService which is now dependant on the exiatance of name, type, rel
            channel.name = channel[propertyMap.ConceptName]
            channel.type = channel[propertyMap.ConceptImTypeFull]

            this.extendState({ channel, selected })
        }
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

    mouseEnter() {
        this.extendState({ isHovered: true })
    }

    mouseLeave() {
        this.extendState({ isHovered: false })
    }

    getIcon() {
        const { selected, isHovered } = this.state
        let icon = 'fa-circle-o'

        if (selected && isHovered) {
            icon = 'fa-times-circle'
        }

        if (selected && !isHovered) {
            icon = 'fa-check-circle-o'
        }

        if (!selected && isHovered) {
            icon = 'fa-plus'
        }

        return icon
    }

    render($$){
        const { channel, selected } = this.state

        return $$('div',{ class: `channel-component ${selected ? 'selected' : ''}` }, [
            $$(ChannelIconComponent, { ...this.props }).ref(`channelIconComponent-${channel.uuid}`),
            // $$('div', { class: 'channel-text-wrapper' }, channel[propertyMap.ConceptName].slice(0, 3)),
            $$('i', { class: `channel-icon fa ${this.getIcon()}` }).ref(`channelIconComponent-${channel.uuid}-icon`)
        ])
        .on('click', () => {
            return selected ?
                this.props.removeChannelFromArticle(channel) :
                this.props.addChannelToArticle(channel)
        })
        .on('mouseenter', this.mouseEnter.bind(this))
        .on('mouseleave', this.mouseLeave.bind(this))
    }

}

export default ChannelComponent
import { Component } from 'substance'
import { ConceptService } from 'writer'
import ChannelIconComponent from './ChannelIconComponent'

class ChannelComponent extends Component {

    constructor(...args) {
        super(...args)

        this.mouseEnter = this.mouseEnter.bind(this)
        this.mouseLeave = this.mouseLeave.bind(this)
    }

    async willReceiveProps(newProps) {
        let { channel, propertyMap } = newProps

        if (channel) {
            channel = await ConceptService.fetchConceptItemProperties(channel)

            // TODO: Fix this in ConceptService which is now dependant on the exiatance of name, type
            channel.name = channel[propertyMap.ConceptName]
            channel.type = channel[propertyMap.ConceptImTypeFull]

            this.extendState({ channel })
        }
    }

    mouseEnter() {
        this.extendState({ isHovered: true })
    }

    mouseLeave() {
        this.extendState({ isHovered: false })
    }

    getIcon() {
        const { isSelected, isMainChannel } = this.props
        const { isHovered } = this.state

        let icon = 'fa-share-alt'

        if (isMainChannel) {
            icon = 'fa-sitemap'
        } else {
            if (isSelected && isHovered) {
                icon = 'fa-times-circle'
            }

            if (isSelected && !isHovered) {
                icon = 'fa-check'
            }

            if (!isSelected && isHovered) {
                icon = 'fa-plus'
            }
        }

        return icon
    }

    render($$){
        const { channel, isSelected, isMainChannel } = this.props

        return $$('div', { class: `channel-component ${isSelected ? 'selected' : ''} ${isMainChannel ? 'mainchannel' : ''}` }, [
            $$(ChannelIconComponent, { ...this.props }).ref(`channelIconComponent-${channel.uuid}`),
            $$('i', { class: `channel-icon fa ${this.getIcon()}` }).ref(`channelIconComponent-${channel.uuid}-icon`)
        ])
        .on('click', () => {
            if (!isMainChannel) {
                return isSelected ?
                    this.props.removeChannelFromArticle(channel) :
                    this.props.addChannelToArticle(channel)
            }
        })
        .on('mouseenter', this.mouseEnter)
        .on('mouseleave', this.mouseLeave)
    }

}

export default ChannelComponent
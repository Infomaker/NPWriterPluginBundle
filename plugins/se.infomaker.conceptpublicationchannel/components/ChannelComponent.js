import { Component } from 'substance'
import { ConceptService } from 'writer'
import ChannelIconComponent from './ChannelIconComponent'

class ChannelComponent extends Component {

    constructor(...args) {
        super(...args)
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

    render($$){
        const { channel, isSelected, isMainChannel, propertyMap } = this.props

        return $$('div', { class: `channel-component ${isSelected ? 'selected' : ''} ${isMainChannel ? 'mainchannel' : ''}`, title: `${channel[propertyMap.ConceptName]}` }, [
            $$(ChannelIconComponent, { ...this.props }).ref(`channelIconComponent-${channel.uuid}`),
            $$('p', { class: `channel-name` }, channel[propertyMap.ConceptName]),
            isMainChannel ? $$('p', { class: 'channel-name mainchannel' }, ' (Huvudkanal)') : ''
        ])
        .on('click', () => {
            if (!isMainChannel) {
                return isSelected ?
                    this.props.removeChannelFromArticle(channel) :
                    this.props.addChannelToArticle(channel)
            }
        })
    }

}

export default ChannelComponent
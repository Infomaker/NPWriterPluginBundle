import { Component } from 'substance'
import ChannelComponent from './ChannelComponent'

class ChannelsComponent extends Component {

    isSelected(channel) {
        return this.props.articleChannels.find(articleChannel => {
            return articleChannel.uuid === channel.uuid
        })
    }

    isMainChannel(channel) {
        const match = this.props.articleChannels.find(articleChannel => {
            return articleChannel.uuid === channel.uuid
        })

        return (match && match.rel === 'mainchannel') ? true : false
    }

    render($$){
        const channels = this.props.channels.map(channel => {
            return $$(ChannelComponent, {
                channel,
                isSelected: this.isSelected(channel),
                isMainChannel: this.isMainChannel(channel),
                ...this.props
            }).ref(`channelComponent-${channel.uuid}`)
        })

        return $$('div', { class: 'channels-component' },
            this.props.pluginConfig.disableMainChannel ? '' : $$('p', { class: 'secondary-channels-title' }, this.getLabel('publication-secondary-channels')),
            ...channels
        ).ref('channelsComponentInstance')
    }

}

export default ChannelsComponent
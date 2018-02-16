import { Component } from 'substance'
import ChannelComponent from './ChannelComponent'

class ChannelsComponent extends Component {

    render($$){
        const channels = this.props.channels.map(channel => {
            return $$(ChannelComponent, { channel, ...this.props }).ref(`channelComponent-${channel.uuid}`)
        })

        return $$('div', { class: 'channels-component' },
            $$('p', { class: 'secondary-channels-title' }, this.getLabel('publication-secondary-channels')),
            ...channels
        ).ref('channelsComponentInstance')
    }

}

export default ChannelsComponent
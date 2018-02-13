import { Component } from 'substance'
import ChannelComponent from './ChannelComponent'

class ChannelsComponent extends Component {

    render($$){
        const channels = this.props.channels.map(channel => {
            return $$(ChannelComponent, { channel, ...this.props }).ref(`channelComponent-${channel.uuid}`)
        })

        return $$('div', { class: 'channels-component' }, channels).ref('channelsComponentInstance')
    }

}

export default ChannelsComponent
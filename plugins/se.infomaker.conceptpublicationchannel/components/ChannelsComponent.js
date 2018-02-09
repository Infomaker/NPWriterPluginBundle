import { Component } from 'substance'
import ChannelComponent from './ChannelComponent'

class ChannelsComponent extends Component {

    render($$){
        const channels = this.props.channels.map(channel => {
            return $$(ChannelComponent, { channel, ...this.props })
        })

        return $$('div', { class: 'channels-component' }, channels)
    }

}

export default ChannelsComponent
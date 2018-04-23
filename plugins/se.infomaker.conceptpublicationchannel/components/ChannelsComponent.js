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

    enforceMainChannel() {
        return this.props.disableMainChannel ? false :
            this.props.articleChannels.find(channel => channel.rel === 'mainchannel') ? false : true
    }

    render($$){
        const sharedChannels = this.props.articleChannels.filter(articleChannel => articleChannel.rel !== 'mainchannel')
        let mainChannel
        if (this.props.mainChannel) {
            mainChannel = $$(ChannelComponent, {
                channel: this.props.mainChannel,
                isSelected: this.isSelected(this.props.mainChannel),
                isMainChannel: this.isMainChannel(this.props.mainChannel),
                ...this.props
            }).ref(`channelComponent-mainComponent-${this.props.mainChannel.uuid}`)
        }
        const channels = this.props.channels.map(channel => {
            return (this.props.mainChannel && this.props.mainChannel.uuid === channel.uuid) ? '' : $$(ChannelComponent, {
                channel,
                isSelected: this.isSelected(channel),
                isMainChannel: this.isMainChannel(channel),
                ...this.props
            }).ref(`channelComponent-${channel.uuid}`)
        })

        return $$('div', { class: `channels-component ${this.enforceMainChannel() ? 'enforce-main-channel' : ''}` },
            !channels.length ? $$('p', { class: 'channels-message' }, this.getLabel('No channels found')) :
                this.enforceMainChannel() ? $$('p', { class: 'channels-message' }, this.getLabel('You have to set a main channel')) : '',
            mainChannel,
            mainChannel ? $$('div', { class: 'main-channel-divider' }, '') : '',
            ...channels,
            channels.length > 2 ? $$('div', { class: 'channels-component-links' }, [
                $$('p', { class: `${this.props.articleChannels.length === channels.length ? 'inactive' : ''}` }, this.getLabel('Select all')).on('click', this.props.selectAll),
                $$('p', { class: `${!sharedChannels.length ? 'inactive' : ''}` }, this.getLabel('Clear all')).on('click', this.props.removeAll)
            ]) : ''
        ).ref('channelsComponentInstance')
    }

}

export default ChannelsComponent
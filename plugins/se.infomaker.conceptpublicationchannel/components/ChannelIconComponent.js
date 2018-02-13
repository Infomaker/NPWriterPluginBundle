import { Component } from 'substance'

class ChannelIconComponent extends Component {

    render($$){
        const avatarUuid = this.props.channel[this.props.propertyMap.ConceptAvatarUuid]

        return $$('div', { class: 'channel-avatar-wrapper' }, [
            avatarUuid.length ? $$('img', { src: `https://baproxy.dev.writer.infomaker.io:5555/objects/${avatarUuid}/files/thumb`, class: 'channel-avatar-image' }) : ''
        ])
    }

}

export default ChannelIconComponent
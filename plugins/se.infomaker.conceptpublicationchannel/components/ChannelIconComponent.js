import { Component } from 'substance'
import { ConceptService } from 'writer'

class ChannelIconComponent extends Component {

    shouldRerender(newProps) {
        const shouldRerender = (
            newProps.channel[this.props.propertyMap.ConceptAvatarUuid] !== this.props.channel[this.props.propertyMap.ConceptAvatarUuid]
        )

        return shouldRerender
    }

    render($$){
        const avatarUuid = this.props.channel[this.props.propertyMap.ConceptAvatarUuid]

        return $$('div', { class: 'channel-avatar-wrapper' }, [
            avatarUuid.length ? $$('img', {
                src: `${ConceptService.getRemoteObjectsPath()}/${avatarUuid}/files/thumb`,
                class: 'channel-avatar-image'
            }) : $$('i', { class: 'fa fa-picture-o' })
        ]).ref(`channelIconComponent-${avatarUuid}`)
    }

}

export default ChannelIconComponent
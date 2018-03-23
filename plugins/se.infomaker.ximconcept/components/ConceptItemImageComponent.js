import { Component } from 'substance'
import { ConceptService } from "writer"

class ConceptItemImageComponent extends Component {

    render($$) {
        const { avatarUuid, extraClass } = this.props

        return $$('div', { class: `concept-item-imagewrapper ${extraClass}` }, [
            avatarUuid.length ? $$('img', {
                src: `${ConceptService.getRemoteObjectsPath()}/${avatarUuid}/files/thumb`,
                class: 'concept-item-image'
            }).ref(`conceptItemImageComponent-${avatarUuid}-image`) : $$('i', { class: 'fa fa-picture-o' })
        ]).ref(`conceptItemImageComponent-${avatarUuid}`)
    }

}

export default ConceptItemImageComponent

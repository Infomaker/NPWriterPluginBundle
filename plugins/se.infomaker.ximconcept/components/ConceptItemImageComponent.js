import { Component } from 'substance'

class ConceptItemImageComponent extends Component {

    /**
     * TODO: Implement functionality to display Concept images or avatars
     * 
     * @param {VirtualElement} $$ 
     */
    render($$){
        const el = $$('div').addClass('concept-item-imagewrapper')
        const img = $$('img', {
            src: this.props.item.src,
            class: 'concept-item-image'
        })

        return el.append(img)
    }

}

export default ConceptItemImageComponent

import { Component } from 'substance'

class ConceptItemImageComponent extends Component {

    render($$){
        const el = $$('div').addClass('concept-item-imagewrapper')
        const img = $$('img', {
            src: this.props.src || 'https://www.placecage.com/c/200/200',
            class: 'concept-item-image'
        })

        return el.append(img)
    }

}

export default ConceptItemImageComponent

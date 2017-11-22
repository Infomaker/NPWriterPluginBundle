import { Component } from 'substance'
import { ConceptService } from 'writer'

class ConceptSearchItemComponent extends Component {

    didMount() {
        if (this.props.selected) {
            this.props.scrollIntoView(this)
        }
    }

    render($$){
        const {item } = this.props
        const broaderString = ConceptService.extractBroaderText(item)
        const conceptDefinitionShort = $$('p').append(item.ConceptDefinitionShort).addClass('concept-short')
        const statusBar = $$('div').addClass(`statusbar ${item.ConceptStatus}`)
        const icon = $$('i', { class: 'fa fa-check', 'aria-hidden': 'true' })

        const conceptName = $$('p').addClass('concept-name')
            .append(item.ConceptName)
            .append(broaderString.length ? ` (${broaderString})` : '')

        const itemContent = $$('div').addClass('item-content')
            .append(this.props.itemExists ? icon : '')
            .append(conceptName)
            .append(conceptDefinitionShort)

        const el = $$('div').addClass('concept-search-item')
            .addClass(this.props.selected ? 'selected' : '')
            .addClass(this.props.itemExists ? 'exists' : '')
            .append(statusBar)
            .append(itemContent)

        return el
    }

}

export default ConceptSearchItemComponent

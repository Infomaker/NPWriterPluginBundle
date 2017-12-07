import { Component } from 'substance'
import { ConceptService } from 'writer'
import ConceptItemImageComponent from './ConceptItemImageComponent'
import ConceptItemIcon from './ConceptItemIconComponent'

class ConceptSearchItemComponent extends Component {

    didMount() {
        if (this.props.selected) {
            this.props.scrollIntoView(this)
        }
    }

    render($$){
        const {item } = this.props
        const broaderString = ConceptService.extractBroaderText(item)
        const conceptDefinitionShort = item.ConceptDefinitionShort ? $$('p').append(item.ConceptDefinitionShort).addClass('concept-short') : null
        const existsIcon = $$('i', { class: `fa ${this.props.itemExists ? 'fa-check' : ''} search-item-icon search-item-exists`, 'aria-hidden': 'true' })

        let conceptImage, conceptIcon

        const draftText = item.ConceptStatus.indexOf('draft') !== -1 ? $$('span').addClass('draft-text').append(' (draft)') : null

        const replacedBy = item.ConceptReplacedByRelation ?
            $$('span').addClass('replaced-by-text').append(this.getLabel('Replaced by'))
                .append($$('span').addClass('replaced-by-item').append(` ${item.ConceptReplacedByRelation.ConceptName}`)) :
            null

        const conceptNameContent = $$('span').addClass(`concept-name ${item.ConceptStatus} ${item.ConceptReplacedByRelation ? 'replaced-by' : ''}`)
            .append(item.ConceptName)
            .append(broaderString.length ? ` (${broaderString})` : '')
            
        const conceptName = $$('p')
            .append(conceptNameContent)
            .append(draftText)
            .append(replacedBy)

        if (item.image) {
            conceptImage = $$(ConceptItemImageComponent, {
                src: item.image
            })
        } else {
            conceptIcon = $$(ConceptItemIcon, {
                item
            })
        }

        const itemContent = $$('div').addClass('item-content')
            .append(conceptName)
            .append(conceptDefinitionShort)

        const el = $$('div').addClass('concept-search-item')
            .addClass(this.props.selected ? 'selected' : '')
            .addClass(this.props.itemExists ? 'exists' : '')
            .addClass(item.create ? 'create' : '')
            .append(existsIcon)
            .append(conceptImage)
            .append(conceptIcon)
            .append(itemContent)

        return el
    }

}

export default ConceptSearchItemComponent

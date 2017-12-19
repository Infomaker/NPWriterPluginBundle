import { Component } from 'substance'
import { ConceptService, api } from 'writer'
import ConceptItemImageComponent from './ConceptItemImageComponent'
import ConceptItemIcon from './ConceptItemIconComponent'

class ConceptSearchItemComponent extends Component {

    constructor(...args) {
        super(...args)

        this.Tooltip = api.ui.getComponent('tooltip')
    }

    didMount() {
        if (this.props.selected) {
            this.props.scrollIntoView(this)
        }
    }

    render($$){
        const { item, propertyMap } = this.props
        const broaderString = this.props.enableHierarchy ? ConceptService.extractBroaderText(item, true) : ''
        const fullBroaderString = ConceptService.extractBroaderText(item)
        const conceptDefinitionShort = item[propertyMap.ConceptDefinitionShort] ? $$('p').append(item[propertyMap.ConceptDefinitionShort]).addClass('concept-short') : null
        const existsIcon = $$('i', { class: `fa ${this.props.itemExists ? 'fa-check' : ''} search-item-icon search-item-exists`, 'aria-hidden': 'true' })
        const tooltip = broaderString.length ? $$(this.Tooltip, {
            title: `${fullBroaderString}`,
            text: '',
            fixed: true,
            parent: this.refs.truncatedBroader,
        }).ref('tooltip') : null

        let conceptImage, conceptIcon

        const draftText = item[propertyMap.ConceptStatus].indexOf('draft') !== -1 ? $$('span').addClass('draft-text').append(' (draft)') : null

        const replacedBy = item[propertyMap.ConceptReplacedByRelation] ?
            $$('span').addClass('replaced-by-text').append(this.getLabel('Replaced by'))
                .append($$('span').addClass('replaced-by-item').append(` ${item[propertyMap.ConceptReplacedByRelation][propertyMap.ConceptName]}`)) :
            null

        const broaderSpan = $$('span', { class: 'concept-broader'})
            .on('mouseenter', () => { this.refs.tooltip.extendProps({ show: true }) })
            .on('mouseleave', () => { this.refs.tooltip.extendProps({ show: false }) })
            .append(broaderString.length ? ` ${broaderString}` : '')
            .append(broaderString.length ? tooltip : '')
            .ref('truncatedBroader')

        const conceptNameContent = $$('span').addClass(`concept-name ${item[propertyMap.ConceptStatus]} ${item[propertyMap.ConceptReplacedByRelation] ? 'replaced-by' : ''}`)
            .append(item[propertyMap.ConceptName])
            .append(broaderSpan)
            
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
                propertyMap,
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

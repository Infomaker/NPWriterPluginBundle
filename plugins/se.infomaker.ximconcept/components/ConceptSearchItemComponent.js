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
        const avatarUuid = item[propertyMap.ConceptAvatarUuid]
        const broaderString = (this.props.enableHierarchy && item[propertyMap.ConceptBroaderRelation]) ? `(${ConceptService.extractBroaderText(item, true)})` : ''
        const fullBroaderString = ConceptService.extractBroaderText(item)
        const conceptDefinitionShort = item[propertyMap.ConceptDefinitionShort] ? $$('p').append(item[propertyMap.ConceptDefinitionShort]).addClass('concept-short') : null
        const existsIcon = $$('i', { class: `fa ${this.props.itemExists ? 'fa-check' : ''} search-item-icon search-item-exists`, 'aria-hidden': 'true' })

        const tooltip = broaderString.length ? $$(this.Tooltip, {
            title: `${fullBroaderString}`,
            text: '',
            fixed: true,
            parent: this.refs.truncatedBroader,
        }).ref('tooltip') : null


        const conceptImage = avatarUuid ? $$(ConceptItemImageComponent, {
            propertyMap,
            src: item,
            avatarUuid: avatarUuid,
        }).ref(`searchResult-conceptItemImageComponent-${item.uuid}`) : ''

        const conceptIcon = !avatarUuid ? $$(ConceptItemIcon, {
            propertyMap,
            item
        }) : ''

        const broaderWrapper = $$('span')

        if (item[propertyMap.ConceptBroaderRelation] && item[propertyMap.ConceptBroaderRelation][propertyMap.ConceptBroaderRelation]) {
            const broaderIcon = $$('i', { class: 'fa fa-question-circle search-item-icon', 'aria-hidden': 'true' })

            broaderWrapper.append(broaderIcon)
                .append(tooltip)
                .on('mouseenter', () => { this.refs.tooltip.extendProps({ show: true }) })
                .on('mouseleave', () => { this.refs.tooltip.extendProps({ show: false }) })
        }

        const draftText = item[propertyMap.ConceptStatus].indexOf('draft') !== -1 ? $$('span').addClass('draft-text').append(' (draft)') : null

        const replacedBy = item[propertyMap.ConceptReplacedByRelation] ?
            $$('span').addClass('replaced-by-text').append(this.getLabel('Replaced by'))
                .append($$('span').addClass('replaced-by-item').append(` ${item[propertyMap.ConceptReplacedByRelation][propertyMap.ConceptName]}`)) :
            null

        const broaderSpan = $$('span', { class: 'concept-broader'})
            .append((broaderString.length && !item[propertyMap.ConceptReplacedByRelation]) ? ` ${broaderString}` : '')
            .append((broaderString.length && !item[propertyMap.ConceptReplacedByRelation]) ? broaderWrapper : '')
            .ref('truncatedBroader')

        const conceptNameContent = $$('span').addClass(`concept-name ${item[propertyMap.ConceptStatus]} ${item[propertyMap.ConceptReplacedByRelation] ? 'replaced-by' : ''}`)
            .append(item[propertyMap.ConceptName])
            .append(draftText)
            .append(broaderSpan)

        const conceptName = $$('p')
            .append(conceptNameContent)
            .append(replacedBy)

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

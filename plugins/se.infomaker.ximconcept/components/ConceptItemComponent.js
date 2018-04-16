import { Component } from 'substance'
import { ConceptService, api } from 'writer'
import ConceptItemImageComponent from './ConceptItemImageComponent'
import ConceptItemIcon from './ConceptItemIconComponent'

class ConceptItemComponent extends Component {

    constructor(...args) {
        super(...args)

        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.editItem = this.editItem.bind(this)
        this.removeItem = this.removeItem.bind(this)
    }

    getInitialState() {
        return { isHovered: false }
    }

    async willReceiveProps(newProps) {
        let { item } = newProps

        this.setState({
            item: await ConceptService.fetchConceptItemProperties(item)
        })
    }

    didMount() {
        this.Tooltip = api.ui.getComponent('tooltip')
    }

    onMouseEnter() {
        if (!this.state.isHovered && this.refs.tooltip) {
            this.refs.tooltip.extendProps({
                show: true
            })
        }
        this.extendState({ isHovered: true })
    }

    onMouseLeave() {
        if (this.state.isHovered && this.refs.tooltip) {
            this.refs.tooltip.extendProps({
                show: false
            })
        }
        this.extendState({ isHovered: false })
    }

    getTooltipString(item, propertyMap, isDuplicate) {
        const truncatedDescription = !item[propertyMap.ConceptDefinitionShort] ? '' :
            item[propertyMap.ConceptDefinitionShort].length > 34 ? `${item[propertyMap.ConceptDefinitionShort].substring(0, 34, ).trim()}...` :
                item[propertyMap.ConceptDefinitionShort]

        return !this.hasValidUUid() ? this.getLabel('Invalid UUID') : isDuplicate ? this.getLabel('Duplicate') : truncatedDescription
    }

    render($$){
        const { item, isHovered } = this.state
        const { propertyMap } = this.props
        const type = (item && item[propertyMap.ConceptImTypeFull]) ? item[propertyMap.ConceptImTypeFull] : ''
        const editable = this.props.editable ? 'editable' : ''
        const el = $$('div')

        let icon
        let removeIcon
        let image

        if (item) {
            const avatarUuid = item[propertyMap.ConceptAvatarUuid]
            const isDuplicate = this.props.isDuplicate(item)
            const broaderString = ConceptService.extractBroaderText(item)
            const tootltipString = this.getTooltipString(item, propertyMap, isDuplicate)

            const tooltip = tootltipString.length ? $$(this.Tooltip, {
                title: `${broaderString}`,
                text: tootltipString,
                fixed: true,
                parent: this,
            }).ref('tooltip') : ''

            if (avatarUuid) {
                image = $$(ConceptItemImageComponent, {
                    propertyMap,
                    src: item,
                    avatarUuid: avatarUuid,
                    extraClass: isHovered ? 'hide' : ''
                }).ref(`conceptItemImageComponent-${item.uuid}`)
            }

            if (!avatarUuid || isHovered) {
                icon = $$(ConceptItemIcon, {
                    isHovered,
                    item,
                    propertyMap,
                    editable: this.props.editable
                })
            }

            removeIcon = $$('i', {
                "class": `fa ${isHovered ? 'fa-times remove' : ''} concept-remove-item-icon`,
                "aria-hidden": "true"
            }).on('click', this.removeItem)

            const itemContent = $$('div')
                .addClass('concept-item-content')
                .append(item.name || item.title || item[propertyMap.ConceptName])
                .append(tooltip)

            el.addClass(`concept-item-component ${item[propertyMap.ConceptStatus]} ${!this.hasValidUUid() ? 'invalid-uuid' : ''} ${item.error ? 'not-found' : ''}`)
                .addClass(isDuplicate ? 'duplicate' : '')
                .append(image)
                .append(icon)
                .append(itemContent)
                .append(removeIcon)
                .addClass(`${type} ${editable}`)
                .on('mouseenter', this.onMouseEnter)
                .on('mouseleave', this.onMouseLeave)
                .on('click', this.editItem)
        }

        return el
    }

    hasValidUUid() {
        return (this.props.item.uuid && this.props.item.uuid !== '' && this.props.item.uuid !== '00000000-0000-0000-0000-000000000000')
    }

    removeItem(e) {
        e.preventDefault()
        e.stopPropagation()
        this.props.removeItem(this.state.item)
    }

    editItem() {
        if (this.props.editable) {
            if (!this.hasValidUUid()) {
                api.ui.showNotification('conceptItemEdit', this.getLabel('Invalid UUID'), this.getLabel('Invalid Concept-UUID'))
            } else if (this.state.item.error) {
                api.ui.showNotification('conceptItemEdit', this.getLabel('Invalid Concept Item'), this.getLabel('Unable to fetch the concept item'))
            } else {
                this.props.editItem(this.props.item)
            }
        }
    }

}

export default ConceptItemComponent
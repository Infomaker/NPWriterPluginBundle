import { Component } from 'substance'
import { ConceptService, api } from 'writer'
import ConceptItemImageComponent from './ConceptItemImageComponent'
import ConceptItemIcon from './ConceptItemIconComponent'

class ConceptItemComponent extends Component {

    getInitialState() {
        return { isHovered: false }
    }

    async willReceiveProps(newProps) {
        let { item } = newProps

        if (item) {
            this.setState({
                item: await ConceptService.fetchConceptItemProperties(item)
            })
        }
    }

    didMount() {
        this.Tooltip = api.ui.getComponent('tooltip')
    }

    onMouseEnter() {
        if (!this.state.isHovered) {
            this.refs.tooltip.extendProps({
                show: true
            })
            this.extendState({ isHovered: true })
        }
    }

    onMouseLeave() {
        if (this.state.isHovered) {
            this.refs.tooltip.extendProps({
                show: false
            })
            this.extendState({ isHovered: false })
        }
    }

    render($$){
        const { item, isHovered } = this.state
        const type = (item && item.ConceptImTypeFull) ? item.ConceptImTypeFull : ''
        const editable = this.props.editable ? 'editable' : ''
        const el = $$('div')
        
        let icon
        let removeIcon
        let image

        if (item) {
            const broaderString = this.props.enableHierarchy ? ConceptService.extractBroaderText(item) : ''
            const tooltip = $$(this.Tooltip, {
                title: `${item.ConceptDefinitionShort || ' - '}`,
                text: `(status: ${item.ConceptStatus})`,
                parent: this,
            }).ref('tooltip')

            if (item.image && !isHovered) {
                image = $$(ConceptItemImageComponent, {
                    src: image
                })
            } else {
                icon = $$(ConceptItemIcon, {
                    isHovered,
                    item,
                    editable: this.props.editable
                }).on('click', this.editItem.bind(this))
            }

            removeIcon = $$('i', {
                "class": `fa ${isHovered ? 'fa-times remove' : ''} concept-remove-item-icon`,
                "aria-hidden": "true"
            }).on('click', this.removeItem.bind(this))

            const itemContent = $$('div')
                .addClass('concept-item-content')
                .append(item.name || item.title || item.ConceptName)
                .append(tooltip)
                .on('click', this.editItem.bind(this))

            if (broaderString.length) {
                itemContent.append(` (${broaderString})`)
            }

            el.addClass(`concept-item-component ${item.ConceptStatus}`)
                .append(image)
                .append(icon)
                .append(itemContent)
                .append(removeIcon)
                .addClass(`${type} ${editable}`)
                .on('mouseenter', this.onMouseEnter)
                .on('mouseleave', this.onMouseLeave)
        }

        return el
    }

    removeItem(e) {
        e.preventDefault()
        this.props.removeItem(this.state.item)
        return false
    }

    editItem() {
        if (this.props.editable) {
            this.props.editItem(this.props.item)
        }
    }

}

export default ConceptItemComponent
import { Component } from 'substance'
import { ConceptService, api } from 'writer'

class ConceptItemComponent extends Component {

    getInitialState() {
        return { isHovered: false }
    }

    getConceptTypeIcon(type) {
        const conceptTypeIcons = {
            'x-im/category': 'fa-folder',
            'x-im/tag': 'fa-tag',
            'x-im/person': 'fa-user',
            'x-im/organisation': 'fa-sitemap',
            'x-im/content-profile': 'fa-cogs',

            'x-im/place': 'fa-map-marker',
            'x-im/position': 'fa-map-marker',
            'x-im/polygon': 'fa-map',

            'x-im/event': 'fa-map-marker',
            'x-im/author': 'fa-user',
            'x-im/story': 'fa-circle',

            'x-im/channel': 'fa-random',
            'x-im/topic': 'fa-tag',
        }

        return conceptTypeIcons[type] || ''
    }

    async didMount() {
        let { item } = this.props
        if (item && !this.state.item) {
            this.setState({
                item: await ConceptService.fetchConceptItemProperties(item)
            })
        }
    }

    getIconString() {
        const conceptType = this.state.item.ConceptImSubTypeFull ? this.state.item.ConceptImSubTypeFull : this.state.item.ConceptImTypeFull
        return this.state.isHovered ? 'fa-times remove' : this.getConceptTypeIcon(conceptType)
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
        const { item } = this.state
        const type = (item && item.ConceptImTypeFull) ? item.ConceptImTypeFull : ''
        const editable = this.props.editable ? 'editable' : ''
        const el = $$('div')

        if (item) {
            const Tooltip = api.ui.getComponent('tooltip')
            const broaderString = this.props.enableHierarchy ? ConceptService.extractBroaderText(item) : ''
            const statusBar = $$('div').addClass(`statusbar ${item.ConceptStatus}`)
            const tooltip = $$(Tooltip, {
                title: `${item.ConceptDefinitionShort || ' - '}`,
                text: `(status: ${item.ConceptStatus})`,
                parent: this,
            }).ref('tooltip')

            const title = $$('span')
                .append(item.title || item.ConceptName)

            const icon = $$('i', {
                "class": `fa ${this.getIconString()}`,
                "aria-hidden": "true"
            }).on('click', () => { this.props.removeItem(item) })

            const itemContent = $$('div')
                .addClass('concept-item-content')
                .append(title)
                .append(tooltip)

            if (broaderString.length) {
                itemContent.append(` (${broaderString})`)
            }

            itemContent.append(icon)

            el.addClass('concept-item-component')
                .append(statusBar)
                .append(itemContent)
                .addClass(`${type} ${editable}`)
                .on('mouseenter', this.onMouseEnter)
                .on('mouseleave', this.onMouseLeave)
                .on('click', this.editItem)
        }

        return el
    }

    editItem() {
        if (this.props.editable) {
            this.props.editItem(this.props.item)
        }
    }

}

export default ConceptItemComponent
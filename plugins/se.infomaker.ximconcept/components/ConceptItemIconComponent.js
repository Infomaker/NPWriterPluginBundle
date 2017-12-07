import { Component } from 'substance'

class ConceptItemIconComponent extends Component {

    getConceptTypeIcon(type) {
        const conceptTypeIcons = {
            'x-im/category': 'fa-folder',
            'x-im/tag': 'fa-tag',
            'x-im/person': 'fa-user',
            'x-im/contact-info': 'fa-user',
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

    getIconString() {
        return (this.props.isHovered && this.props.editable) ? 'fa-pencil' : this.getConceptTypeIcon(this.getItemConceptType())
    }

    getItemConceptType() {
        if (this.props.item.ConceptImTypeFull === 'x-im/place') {
            return this.props.item.ConceptImSubTypeFull ? this.props.item.ConceptImSubTypeFull : this.props.item.ConceptImTypeFull
        }

        return this.props.item.ConceptImTypeFull
    }

    render($$){
        const el = $$('div').addClass('concept-item-icon-wrapper')
        const icon = $$('i', {
            "class": `fa ${this.getIconString()} concept-item-icon ${this.getItemConceptType()}`,
            "aria-hidden": "true"
        })
        
        return el.append(icon)
    }

}

export default ConceptItemIconComponent
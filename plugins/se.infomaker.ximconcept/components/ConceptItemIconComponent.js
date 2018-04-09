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

            // TODO: Refactor this to use external config-file
            'x-cu/industry': 'industry',
            'x-cu/responsibilities': 'calendar-check-o',
            'x-cu/project': 'balance-scale'
        }

        return conceptTypeIcons[type] || 'fa-question-circle-o'
    }

    getIconString() {
        return (this.props.isHovered && this.props.editable) ? 'fa-pencil' : this.getConceptTypeIcon(this.getItemConceptType())
    }

    getItemConceptType() {
        const {propertyMap} = this.props
        if (this.props.item[propertyMap.ConceptImTypeFull] === 'x-im/place') {
            return this.props.item[propertyMap.ConceptImSubTypeFull] ? this.props.item[propertyMap.ConceptImSubTypeFull] : this.props.item[propertyMap.ConceptImTypeFull]
        }

        return this.props.item[propertyMap.ConceptImTypeFull]
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
import { Component } from "substance"
import ConceptItemComponent from './ConceptItemComponent'

class ConceptListComponent extends Component {

    isDuplicate(item) {
        const match = this.props.existingItems.filter(existingItem => existingItem.uuid === item.uuid)

        return (match.length > 1)
    }

    render($$) {
        let spinner
        let icon = this.props.icon
        const { editable, working, propertyMap } = this.props

        if (working) {
            spinner = $$('i', {
                class: 'fa fa-spinner fa-spin conceptlist-spinner',
                "aria-hidden": 'true'
            })
        }

        const listItems = this.props.existingItems.map((item, index) => {
            if (this.props.types) {
                Object.keys(this.props.types).forEach(type => {
                    const itemType = item[propertyMap.ConceptImTypeFull] || item.type
                    if (itemType === type) {
                        const typeIcon = this.props.types[type].icon
                        if (typeIcon && typeIcon.length) {
                            icon = typeIcon
                        }
                    }
                })
            }

            return $$(ConceptItemComponent, {
                item,
                editable,
                icon,
                propertyMap,
                enableHierarchy: this.props.enableHierarchy,
                editItem: this.props.editItem,
                removeItem: this.props.removeItem,
                key: item.uuid,
                isDuplicate: this.isDuplicate.bind(this)
            }).ref(`conceptItem-${item.uuid}-${index}`)
        })

        const el = $$('div', { class: 'concept-list-component' }, [
            listItems,
            spinner,
        ]).ref('conceptListComponent')

        return el
    }
}

export default ConceptListComponent

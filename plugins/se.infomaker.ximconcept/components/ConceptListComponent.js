import { Component } from "substance"
import ConceptItemComponent from './ConceptItemComponent'

class ConceptListComponent extends Component {

    constructor(...args) {
        super(...args)

        this.isDuplicate = this.isDuplicate.bind(this)
    }

    isDuplicate(item) {
        const match = this.props.existingItems.filter(existingItem => existingItem.uuid === item.uuid)

        return (match.length > 1)
    }

    render($$) {
        let spinner
        const { working } = this.props

        if (working) {
            spinner = $$('i', {
                class: 'fa fa-spinner fa-spin conceptlist-spinner',
                "aria-hidden": 'true'
            })
        }

        const listItems = this.props.existingItems.map((item, index) => {
            return $$(ConceptItemComponent, {
                item,
                ...this.props,
                key: item.uuid,
                isDuplicate: this.isDuplicate
            }).ref(`conceptItem-${item.uuid}-${index}`)
        })

        return $$('div', { class: 'concept-list-component' }, [
            listItems,
            spinner,
        ]).ref('conceptListComponent')
    }
}

export default ConceptListComponent

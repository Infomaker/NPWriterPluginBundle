import { Component } from "substance"
import ConceptItemComponent from './ConceptItemComponent'

class ConceptListComponent extends Component {

    render($$) {
        let spinner
        const { editable, working } = this.props

        if (working) {
            spinner = $$('i', {
                class: 'fa fa-spinner fa-spin conceptlist-spinner',
                "aria-hidden": 'true'
            })
        }

        const listItems = this.props.existingItems.map(item => {
            return $$(ConceptItemComponent, {
                item,
                editable,
                enableHierarchy: this.props.enableHierarchy,
                editItem: this.props.editItem,
                removeItem: this.props.removeItem,
                key: item.uuid
            }).ref(`conceptItem-${item.uuid}`)
        })
        const el = $$('div')
            .addClass('concept-list-component')
            .append(listItems)
            .append(spinner)
            .ref('conceptListComponent')

        return el
    }
}

export default ConceptListComponent

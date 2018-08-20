import { Component } from 'substance'
import { TextPropertyComponent } from 'substance'

export default class ListItemComponent extends Component {
    render ($$) {
        const node = this.props.node
        const path = node.getPath()

        const el = $$('li').addClass('sc-list-item')
        el.append(
            $$(TextPropertyComponent, {
                path,
                doc: node.getDocument()
            }).ref('text')
        )
        // for nested lists
        if (this.props.children) {
            el.append(this.props.children)
        }
        return el
    }
}

import renderListNode from '../utils/RenderListNode'
import { NodeComponent } from 'substance'
import ListItemComponent from './ListItemComponent'

export default class ListComponent extends NodeComponent {
    render ($$) {
        let node = this.props.node
        console.info('LIST')
        const el = renderListNode(node, (item) => {
            console.info('INSIDE CALLBACK, ITEM: ', item)
            // item is either a list item node, or a tagName
            if (typeof item === 'string') {
                return $$(item)
            } else if (item.type === 'list-item') {
                return $$(ListItemComponent, {
                    node: item
                }).ref(item.id)
            }
        })
        el.addClass('sc-list').attr('data-id', node.id)
        return el
    }

    // we need this ATM to prevent this being wrapped into an isolated node (see ContainerEditor._renderNode())
    get _isCustomNodeComponent () { return true }
}

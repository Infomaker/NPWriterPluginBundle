/**
 * Modified version of substance table cell node
 * https://github.com/substance/substance/blob/v1.0.0-beta.6.5/packages/table/TableCell.js
 */
import {TextNode} from 'substance'

class TableCellNode extends TextNode {
    get table() {
        const parentNode = this.getParent()
        if (!parentNode) { return null }
        if (parentNode.type === 'table') {
            return parentNode
        }
        return null
    }

    /**
     * There is a bug (or intended feature?) in substance.ParentNodeHook._onOperationApplied that causes
     * the table cell's parent to be set to the table node instead of the table node's ID.
     * When the table has rows with only one cell something breaks when parent is set to the actual
     * node, so we mitigate this by checking if parent is being set to a node (val has an ID) and set
     * parent to that ID.
     */
    set parent(val) {
        console.warn('Setting parent to', val)
        if (val && val.id) {
            val = val.id
        }
        this._parent = val
    }

    get parent() {
        return this._parent
    }
}

TableCellNode.schema = {
    type: 'table-cell',
    parent: { type: 'string', owned: false },
    rowspan: { type: 'number', default: 0 },
    colspan: { type: 'number', default: 0 }
}

export default TableCellNode

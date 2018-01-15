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
}

TableCellNode.schema = {
    type: 'table-cell',
    parent: { type: 'id' },
    rowspan: { type: 'number', default: 0 },
    colspan: { type: 'number', default: 0 }
}

export default TableCellNode

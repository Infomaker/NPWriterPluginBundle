/**
 * Modified version of substance table node
 * https://github.com/substance/substance/blob/v1.0.0-beta.6.5/packages/table/TableCell.js
 */
import {TextNode} from 'substance'

class TableCellNode extends TextNode {}

TableCellNode.schema = {
    type: 'table-cell',
    rowspan: { type: 'number', default: 0 },
    colspan: { type: 'number', default: 0 }
}

export default TableCellNode

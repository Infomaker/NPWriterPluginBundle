/**
 * Modified version of substance table cell converter
 * https://github.com/substance/substance/blob/v1.0.0-beta.6.5/packages/table/TableCellHTMLConverter.js
 */
import {uuid} from 'substance'

export default {
    type: 'table-cell',
    tagName: 'td',

    matchElement: function(el) {
        return el.is('td, th')
    },

    import: function (el, node, converter) {
        if (!el.id) {
            node.id = uuid(this.type)
        }
        node.content = converter.annotatedText(el, [node.id, 'content'])
        let colspan = el.attr('colspan')
        let rowspan = el.attr('rowspan')
        if (colspan) {
            node.colspan = Number(colspan)
        }
        if (rowspan) {
            node.rowspan = Number(rowspan)
        }
    },

    export: function (node, el, converter) {
        const convertedCell = converter.annotatedText([node.id, 'content'])
        el.append(convertedCell)
        if (node.rowspan > 0) {
            el.attr('rowspan', node.rowspan)
        }
        if (node.colspan > 0) {
            el.attr('colspan', node.colspan)
        }
        return el
    }
}

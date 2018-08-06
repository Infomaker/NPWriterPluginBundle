/**
 * Modified version of substance table converter
 * https://github.com/substance/substance/blob/v1.0.0-beta.6.5/packages/table/TableHTMLConverter.js
 */
import {uuid} from 'substance'

export default {
    type: 'table',
    tagName: 'table',

    matchElement: function(el) {
        return el.is('table')
    },

    _getColspan(colspans, rowIndex, colIndex) {
        if (!colspans[rowIndex]) {
            return 0
        }
        return colspans[rowIndex][colIndex]
    },

    _setColspan(colspans, rowIndex, colIndex, num) {
        if (!colspans[rowIndex]) {
            colspans[rowIndex] = []
        }
        colspans[rowIndex][colIndex] = num
    },

    // From newsml to node
    import: function(el, node, converter) {
        if (!el.id) {
            node.id = uuid(this.type)
        }

        const trs = [...el.findAll('thead > tr'), ...el.findAll('tbody > tr'), ...el.findAll('tfoot > tr')]
        const metaCols = [...el.findAll('meta > col')]
        const rowspans = [] // we remember active rowspans here
        const colspans = [] // we remember active colspans here

        node.meta = metaCols.map((col) => {
            return {
                id: parseInt(col.attr('id'), 10),
                format: col.attr('format'),
                index: col.attr('index')
            }
        })

        node.cells = trs.map((tr, rowIndex) => {
            const row = []
            // colspans result in `tds` being shorter than colCount so we have to keep track of the nodes
            // actual colIndex.
            let nodeColIndex = 0
            tr.getChildren().forEach(td => {
                // if there is an open rowspan
                if (rowspans[nodeColIndex] > 1) {
                    row.push(null)
                    rowspans[nodeColIndex] -= 1 // count down until exhausted
                    nodeColIndex += 1 // Must be increased since we added a null cell
                }

                const tableCell = converter.convertElement(td)

                // Set table cell parent to table id
                tableCell.parent = node.id
                row.push(tableCell.id)
                nodeColIndex += 1

                // Add null cells for stored colspan
                const colspan = this._getColspan(colspans, rowIndex, nodeColIndex)
                if (colspan > 1) {
                    for (let index = 0; index < colspan; index++) {
                        row.push(null)
                        rowspans[nodeColIndex] -= 1
                        nodeColIndex += 1
                    }
                }

                // Remember rowspans
                if (tableCell.rowspan > 1) {
                    rowspans[nodeColIndex - 1] = tableCell.rowspan
                }

                if (tableCell.colspan > 1) {
                    // Remember any colspans for the next rows
                    if (tableCell.rowspan > 1) {
                        for (let index = 1; index < tableCell.rowspan; index++) {
                            this._setColspan(colspans, rowIndex + index, nodeColIndex - 1, tableCell.colspan)
                        }
                    }

                    // Add null values for current td colspan
                    for (let q = 0; q < tableCell.colspan - 1; q++) {
                        row.push(null)
                        nodeColIndex += 1 // Must be increased since we added a null cell
                    }
                }
            })
            return row
        })

        node.header = Boolean(el.find('thead'))
        node.footer = Boolean(el.find('tfoot'))
        const caption = el.find('caption')
        if (caption) {
            node.caption = caption.text()
        }
    },

    // from node to newsml
    export: function(node, el, converter) {
        let $$ = converter.$$
        let rowCount = node.rowCount
        let colCount = node.colCount

        let metaElem = $$('meta')
        let theadElem = $$('thead')
        let tbodyElem = $$('tbody')
        let tfootElem = $$('tfoot')

        node.meta.sort((a, b) => {
            return a.id > b.id ? 1 : -1
        }).forEach(({index, format, id}) => {
            if (format || index) {
                const colEl = $$('col')

                colEl.attr('id', id)
                if (index) {
                    colEl.attr('index', index)
                }
                if (format) {
                    colEl.attr('format', format)
                }

                metaElem.append(colEl)
            }
        })

        el.append(metaElem)

        for (let row = 0; row < rowCount; row++) {
            let rowElem = $$('tr')
            for (let col = 0; col < colCount; col++) {
                let cellId = node.cells[row][col]
                // Merged cells (cellId is null) are skipped
                if (cellId) {
                    let cellElem = converter.convertNode(cellId)
                    if (node.header && row === 0) {
                        cellElem.setTagName('th')
                    }
                    rowElem.append(cellElem)
                }
            }

            if (node.header && row === 0) {
                theadElem.append(rowElem)
            } else if (node.footer && row === rowCount - 1) {
                tfootElem.append(rowElem)
            } else {
                tbodyElem.append(rowElem)
            }
        }

        if (node.caption) {
            const captionElem = $$('caption').append(converter.annotatedText([node.id, 'caption']))
            el.append(captionElem)
        }

        /**
         * The <thead> must appear after any <caption> or <colgroup> element, even implicitly defined,
         * but before any <tbody>, <tfoot> and <tr> element.
         * - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
         */
        if (node.header) {
            el.append(theadElem)
        }

        el.append(tbodyElem)

        /**
         * The <tfoot> must appear after any <caption>, <colgroup>, <thead>, <tbody>, or <tr> element.
         * - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
         */
        if (node.footer) {
            el.append(tfootElem)
        }

        return el
    }
}

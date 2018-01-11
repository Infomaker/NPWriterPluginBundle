import {uuid} from 'substance'

export default {
    type: 'table',
    tagName: 'table',

    matchElement: function(el) {
        return el.is('table')
    },

    // From newsml to node
    import: function (el, node, converter) {
        if (!el.id) {
            node.id = uuid(this.type)
        }

        const trs = [...el.findAll('thead > tr'), ...el.findAll('tbody > tr'), ...el.findAll('tfoot > tr')]
        const cells = []
        const rowspans = [] // we remember active rowspans here

        for (let rowIndex = 0; rowIndex < trs.length; rowIndex++) {
            const tds = trs[rowIndex].getChildren()
            const row = []

            // colspans result in `tds` being shorter than colCount so we have to keep track of the nodes
            // actual colIndex.
            let nodeColIndex = 0
            for (let colIndex = 0; colIndex < tds.length; colIndex++) {
                let td = tds[colIndex]
                // if there is an open rowspan
                if (rowspans[nodeColIndex] > 1) {
                    row.push(null)
                    rowspans[nodeColIndex] -= 1 // count down until exhausted
                    nodeColIndex += 1
                } else {
                    rowspans[nodeColIndex] = 0
                }
                const tableCell = converter.convertElement(td)

                // Set table cell parent to table id
                tableCell.parent = node.id
                row.push(tableCell.id)

                if (tableCell.rowspan > 1) {
                    rowspans[nodeColIndex] = tableCell.rowspan
                }

                if (tableCell.colspan > 1) {
                    // Add null values for colspans
                    for (let q = 0; q < tableCell.colspan - 1; q++) {
                        row.push(null)
                    }
                    // throw new Error('Check if this really works. dont think it does, should add colspans to next row too if the previous row had both rowspan and colspan')
                }
                nodeColIndex += 1
            }
            cells.push(row)
        }

        node.cells = cells
        node.header = Boolean(el.find('thead'))
        node.footer = Boolean(el.find('tfoot'))
        const caption = el.find('caption')
        if (caption) {
            node.caption = caption.text()
        }
    },

    // from node to newsml
    export: function (node, el, converter) {
        let $$ = converter.$$
        let rowCount = node.rowCount
        let colCount = node.colCount

        let theadElem = $$('thead')
        let tbodyElem = $$('tbody')
        let tfootElem = $$('tfoot')

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

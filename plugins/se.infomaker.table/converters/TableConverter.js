import {uuid} from 'substance'

export default {
    type: 'table',
    tagName: 'table',

    matchElement: function(el) {
        console.info('Matching table element:', el.is('table'), el)
        return el.is('table')
    },

    // From newsml to node
    import: function (el, node, converter) {
        if (!el.id) {
            node.id = uuid(this.type)
        }

        console.info('Importing table... Node:', node.id, 'Element:', el, 'Converter:', converter)
        let trs = [...el.findAll('thead > tr'), ...el.findAll('tbody > tr'), ...el.findAll('tfoot > tr')]
        let colCount = 0
        let cells = []
        let rowspans = [] // we remember active rowspans here
        for (let rowIndex = 0; rowIndex < trs.length; rowIndex++) {
            let tds = trs[rowIndex].getChildren()
            let row = []
            colCount = Math.max(tds.length, colCount)
            for (let colIndex = 0; colIndex < tds.length; colIndex++) {
                let td = tds[colIndex]
                // if there is an open rowspan
                if (rowspans[colIndex] > 1) {
                    row.push(null)
                    rowspans[colIndex] -= 1 // count down until exhausted
                }
                let tableCell = converter.convertElement(td)
                row.push(tableCell.id)
                if (tableCell.rowspan > 1) {
                    rowspans[colIndex] = tableCell.rowspan
                }
                if (tableCell.colspan > 1) {
                    // Add null values for colspans
                    for (let q = 0; q < tableCell.colspan - 1; q++) {
                        row.push(null)
                    }
                }
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

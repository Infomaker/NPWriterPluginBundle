import { uuid, InsertNodeCommand } from 'substance'

class InsertTableCommand extends InsertNodeCommand {
    createNodeData(tx, params) {
        let cols = 2
        let rows = 2

        const size = params.tableSize

        if (size && Array.isArray(size) && size[0]) {
            cols = parseInt(size[0], 10)
        }

        if (size && Array.isArray(size) && size[1]) {
            rows = parseInt(size[1], 10)
        }

        console.info('Creating a table. Rows:', rows, 'Columns:', cols)
        let rowNodes = []
        for (let row = 0; row < rows; row++) {
            let colNodes = []
            for (let col = 0; col < cols; col++) {

                const cellData = {
                    id: uuid('table-cell'),
                    type: 'table-cell',
                    content: ''
                }

                // if (row === 2 && col === 2) {
                //     cellData.rowspan = 2
                // }

                // if (row === 3 && col === 2) {
                //     cellData.id = null
                // }

                // if (row === 1 && col === 5) {
                //     cellData.colspan = 2
                // }

                // if (row === 1 && col === 6) {
                //     cellData.id = null
                // }

                // if (row === 1 && col === 3) {
                //     cellData.colspan = 2
                // }

                // if (row === 1 && col === 4) {
                //     cellData.id = null
                // }

                // if (row === 2 && col === 2) {
                //     cellData.colspan = 2
                // }

                // if (row === 2 && col === 3) {
                //     cellData.id = null
                // }

                if (cellData.id) {
                    const colNode = tx.create(cellData)
                    console.info(`Cell created at <${row}, ${col}> ID: ${colNode.id}`)
                    colNodes.push(colNode.id)
                } else {
                    console.info(`Null cell created at <${row}, ${col}>`)
                    colNodes.push(null)
                }
            }
            rowNodes.push(colNodes)
        }

        return {
            id: uuid('table'),
            type: 'table',
            // null values mark merged cells
            cells: rowNodes
        }

    }
}

export default InsertTableCommand

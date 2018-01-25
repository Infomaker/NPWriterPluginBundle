import { uuid, InsertNodeCommand } from 'substance'

class InsertTableCommand extends InsertNodeCommand {
    createNodeData(tx, params) {
        const tableNodeId = uuid('table')
        let cols = 2
        let rows = 2

        const size = params.tableSize

        if (size && Array.isArray(size) && size[0]) {
            rows = parseInt(size[0], 10)
        }

        if (size && Array.isArray(size) && size[1]) {
            cols = parseInt(size[1], 10)
        }

        let rowNodes = []
        for (let row = 0; row < rows; row++) {
            let colNodes = []
            for (let col = 0; col < cols; col++) {
                const cellData = {
                    id: uuid('table-cell'),
                    type: 'table-cell',
                    parent: tableNodeId,
                    content: ''
                }
                const colNode = tx.create(cellData)
                colNodes.push(colNode.id)
            }
            rowNodes.push(colNodes)
        }

        return {
            id: tableNodeId,
            type: 'table',
            cells: rowNodes
        }
    }

    getCommandState(params) {
        // Disabled on node selections
        const selectionOnBody = params.surface && params.surface.name === 'body'
        const nodeSelection = params.surface && params.selection.isNodeSelection()
        return {
            disabled: nodeSelection || !selectionOnBody
        }
    }
}

export default InsertTableCommand

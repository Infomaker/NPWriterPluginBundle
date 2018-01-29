import TableCommand from './TableCommand'

class MergeCellsCommand extends TableCommand {
    executeCommandOnTable(params, context) { // eslint-disable-line
        const tableNode = params.commandState.tableNode
        params.editorSession.transaction(tx => {
            tableNode.mergeArea(tableNode.area, tx)
        })
    }
}

export default MergeCellsCommand

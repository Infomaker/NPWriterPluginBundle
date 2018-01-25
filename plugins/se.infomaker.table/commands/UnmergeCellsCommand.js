import TableCommand from './TableCommand'

class UnmergeCellsCommand extends TableCommand {

    executeCommandOnTable(params, context) { // eslint-disable-line
        const tableNode = params.commandState.tableNode
        params.editorSession.transaction(tx => {
            tableNode.unmergeArea(tableNode.area, tx)
        })
    }
}

export default UnmergeCellsCommand

import TableCommand from './TableCommand'

class DeleteColumnCommand extends TableCommand {
    executeCommandOnTable(params, context) { // eslint-disable-line
        const commandState = params.commandState
        let cols = null

        if (this.config.deleteMultiple) {
            // Delete all columns in area
            cols = commandState.cols.reverse()
        } else {
            // Only delete selected column
            cols = [commandState.selectedCol]
        }

        if (!cols) { return false}
        params.editorSession.transaction(tx => {
            cols.forEach(col => {
                commandState.tableNode.deleteColAt(col, tx)
            })
        })
    }
}

export default DeleteColumnCommand

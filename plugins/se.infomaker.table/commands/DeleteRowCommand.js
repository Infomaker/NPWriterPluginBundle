import TableCommand from './TableCommand'

class DeleteRowCommand extends TableCommand {

    executeCommandOnTable(params, context) { // eslint-disable-line
        const commandState = params.commandState
        let rows = null

        if (this.config.deleteMultiple) {
            // Delete all rows in area
            rows = commandState.rows.reverse()
        } else {
            // Only delete selected row
            rows = [commandState.selectedRow]
        }

        if (!rows) { return false}
        params.editorSession.transaction(tx => {
            rows.forEach(row => {
                commandState.tableNode.deleteRowAt(row, tx)
            })
        })

    }
}

export default DeleteRowCommand

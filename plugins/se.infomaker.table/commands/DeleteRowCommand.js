import TableCommand from './TableCommand'

class DeleteRowCommand extends TableCommand {

    execute(params, context) { // eslint-disable-line
        // Get commandState again to make sure we have the right selection
        // TODO: Look into why it's not updated correctly
        const commandState = this.getCommandState(params, context)
        if (commandState && !commandState.disabled) {
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
}

export default DeleteRowCommand

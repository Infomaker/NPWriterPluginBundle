import TableCommand from './TableCommand'

class InsertRowCommand extends TableCommand {

    executeCommandOnTable(params, context) { // eslint-disable-line
        // Get commandState again to make sure we have the right selection
        // TODO: Look into why it's not updated correctly
        const commandState = this.getCommandState(params, context)
        if (commandState && !commandState.disabled) {
            if (!commandState.rows) { return false }
            let rowCount = 1
            let rowIndex = commandState.rows[0]

            if (this.config.insertMultiple) {
                rowCount = commandState.rows.length
            }

            if (!this.config.insertBefore) {
                rowIndex += rowCount
            }

            params.editorSession.transaction(tx => {
                for (let i = rowCount; i > 0; i--) {
                    commandState.tableNode.insertRowAt(rowIndex, tx)
                }
            })
        }
    }
}

export default InsertRowCommand

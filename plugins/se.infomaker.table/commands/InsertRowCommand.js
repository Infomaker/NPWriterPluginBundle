import TableCommand from './TableCommand'

class InsertRowCommand extends TableCommand {

    executeCommandOnTable(params, context) { // eslint-disable-line
        const commandState = params.commandState
        if (!commandState.rows) { return false }
        let rowCount = 1
        let rowIndex = commandState.rows[0]

        // Set how many rows we want to insert
        if (this.config.insertMultiple) {
            rowCount = commandState.rows.length
        }

        // Rows are inserted before by default so we have to increase
        // rowIndex by the amount of rows that are to be inserted to
        // get them to be inserted after the current row(s)
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

export default InsertRowCommand

import TableCommand from './TableCommand'

class InsertColumnCommand extends TableCommand {

    execute(params, context) { // eslint-disable-line
        // Get commandState again to make sure we have the right selection
        // TODO: Look into why it's not updated correctly
        const commandState = this.getCommandState(params, context)
        if (commandState && !commandState.disabled) {
            if (!commandState.cols) { return false }
            let colCount = 1
            let colIndex = commandState.cols[0]

            if (this.config.insertMultiple) {
                colCount = commandState.cols.length
            }

            if (!this.config.insertBefore) {
                colIndex += colCount
            }

            params.editorSession.transaction(tx => {
                for (let i = colCount; i > 0; i--) {
                    commandState.tableNode.insertColAt(colIndex, tx)
                }
            })
        }
    }
}

export default InsertColumnCommand

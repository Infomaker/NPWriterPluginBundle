import TableCommand from './TableCommand'

class InsertColumnCommand extends TableCommand {

    executeCommandOnTable(params, context) { // eslint-disable-line
        const commandState = params.commandState
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

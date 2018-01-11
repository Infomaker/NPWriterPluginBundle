import TableCommand from './TableCommand'

class DeleteColumnCommand extends TableCommand {

    execute(params, context) { // eslint-disable-line
        // Get commandState again to make sure we have the right selection
        // TODO: Look into why it's not updated correctly
        const commandState = this.getCommandState(params, context)
        if (commandState && !commandState.disabled) {
            let cols = null

            if (!params.deleteMultiple) {
                // Delete all columns in area
                if (!commandState.cols) { return false }
                cols = commandState.cols.reverse()

            } else {
                // Only delete selected column
                if (!commandState.selectedCol) { return false }
                cols = [commandState.selectedCol]
            }

            if (!cols) { return false}
            params.editorSession.transaction(tx => {
                cols.forEach(col => {
                    console.info('Deleted column', col)
                    commandState.tableNode.deleteColAt(col, tx)
                })
            })
        }
    }
}

export default DeleteColumnCommand

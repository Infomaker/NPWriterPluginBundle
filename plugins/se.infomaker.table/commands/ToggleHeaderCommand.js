import TableCommand from './TableCommand'

class ToggleHeaderCommand extends TableCommand {
    executeCommandOnTable(params, context) { // eslint-disable-line
        const commandState = params.commandState
        if (!commandState.tableNode) { return false }
        commandState.tableNode.toggleHeader()
    }
}

export default ToggleHeaderCommand

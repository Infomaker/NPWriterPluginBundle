import TableCommand from './TableCommand'

class ToggleFooterCommand extends TableCommand {
    executeCommandOnTable(params, context) { // eslint-disable-line
        const commandState = params.commandState
        if (!commandState.tableNode) { return false }
        commandState.tableNode.toggleFooter()
    }
}

export default ToggleFooterCommand

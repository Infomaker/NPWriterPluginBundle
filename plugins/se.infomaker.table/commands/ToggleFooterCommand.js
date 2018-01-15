import { Command } from 'substance'
import selectionIsInTable from '../util/selectionIsInTable'

class ToggleHeaderCommand extends Command {
    execute(params, context) {
        if (params.commandState && !params.commandState.disabled) {
            console.info('ToggleHeaderCommand params:', params, 'context', context)
            const doc = context.editorSession.getDocument()
            const nodeId = params.selection.getNodeId()
            const node = doc.get(nodeId)

            if (!node) { return }

            let table = null
            if (node.type === 'table') {
                table = node
            } else if (node.type === 'table-cell') {
                table = node.table
            }

            if (!table) { return }

            console.info('Executing header command on node', table)
            table.toggleFooter()
        }
    }

    /**
     * Our command is enabled on table nodes and inside table cells.
     */
    getCommandState(params) {
        const tableSelected = selectionIsInTable(params.selection)
        return {
            disabled: !tableSelected,
            showInContext: tableSelected
        }
    }
}

export default ToggleHeaderCommand

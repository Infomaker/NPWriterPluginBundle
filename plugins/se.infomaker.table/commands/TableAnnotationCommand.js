import { Command } from 'substance'
import { api } from 'writer'
import selectionIsInTable from '../util/selectionIsInTable'

class TableAnnotationCommand extends Command {

    constructor(...args) {
        super(...args)
        if (!this.config.nodeType) {
            throw new Error("'nodeType' is required")
        }
    }

    getAnnotationType() {
        return this.config.nodeType
    }

    execute(params, context) {
        if (params.commandState && !params.commandState.disabled) {
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
            this._executeCommandOnTable(table)
        }
    }

    /**
     * Our command is enabled on table nodes and inside table cells.
     */
    getCommandState(params) {
        return {
            disabled: !selectionIsInTable(params.selection)
        }
    }

    _executeCommandOnTable(table) {
        const commandName = `table-cell-${this.getAnnotationType()}`
        const es = api.editorSession
        const doc = es.document
        const originalSelection = es.getSelection()
        if (table.area && table.area.cells) {
            es.transaction(tx => {
                let shouldCreate
                console.info('Running command on:', table.area.cells)
                table.area.cells.forEach(cellId => {
                    const cell = doc.get(cellId)
                    const selection = tx.createSelection({
                        type: 'property',
                        path: cell.getPath(),
                        startOffset: 0,
                        endOffset: cell.getLength()
                    })

                    // Both transaction and editorSession selection has to be set
                    // to properly execute the command on the cell. Not sure why
                    tx.setSelection(selection)
                    es.setSelection(selection)

                    if (typeof shouldCreate === 'undefined' && cell.getLength()) {
                        const commandMode = es.getCommandStates()[commandName].mode
                        shouldCreate = ['create', 'fuse', 'expand'].includes(commandMode)
                    }

                    // const selectionState = es.getSelectionState()
                    // console.info('Selection state:', selectionState)
                    // console.info('Cell id:', cellId)
                    // console.info('Created selection:', selection)
                    // console.info('Transaction selection path:', tx.getSelection().getPath())
                    // console.info('EditorSession selection path', es.getSelection().getPath())
                    es.executeCommand(commandName, {
                        transaction: tx,
                        shouldCreate: shouldCreate
                    })
                })
                tx.setSelection(originalSelection)
            })
            es.setSelection(originalSelection)
        }
    }
}

export default TableAnnotationCommand

import { Command } from 'substance'
import { api } from 'writer'
import TableEditorDialogComponent from '../components/TableEditorDialogComponent'

class OpenTableEditorCommand extends Command {
    execute(params) {
        if (params.tableNodeId) {
            const editorProps = {
                node: api.editorSession.document.get(params.tableNodeId)
            }

            const dialogProps = {
                title: 'Table editor',
                primary: false,
                secondary: 'Ok',
                takeover: true
            }

            api.ui.showDialog(TableEditorDialogComponent, editorProps, dialogProps)
        }
    }

    /**
     * Our command is only enabled for the main surface.
     */
    getCommandState(params) {
        let isDisabled = true

        // Check if this is a nodeSelection, in that case the contentMenu tools should be disabled
        if (params.surface && params.selection.isNodeSelection()) {
            isDisabled = true
        } else if (params.surface && params.surface.name === 'body') {
            isDisabled = false
        }

        return {
            disabled: isDisabled
        }
    }
}

export default OpenTableEditorCommand

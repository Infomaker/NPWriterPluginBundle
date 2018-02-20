import {NPWriterAnnotationCommand} from 'writer'

class LinkCommand extends NPWriterAnnotationCommand {
    constructor(...args) {
        super(...args)
    }

    canFuse() {
        return false
    }

    getCommandState(params) {
        let sel = this._getSelection(params)

        if (this.isDisabled(sel) || this._selectionIsWhitespace(sel)) {
            return {
                disabled: true
            }
        }

        let annos = this._getAnnotationsForSelection(params)

        let newState = {
            disabled: false,
            active: false,
            mode: null
        }

        if (annos.length === 1 && sel.isPropertySelection() && sel.isCollapsed()) {
            // newState.disabled = annos[0].type === 'link';
            newState.node = annos[0]
        }

        if (this.canCreate(annos, sel)) {
            newState.mode = 'create'
        }
        else if (this.canFuse(annos, sel)) {
            newState.mode = 'fuse'
        }
        else if (this.canTruncate(annos, sel)) {
            newState.active = true
            newState.mode = 'truncate'
        }
        else if (this.canExpand(annos, sel)) {
            newState.mode = 'expand'
        }
        else if (this.canDelete(annos, sel)) {
            newState.active = true
            newState.mode = 'delete'
        }
        else {
            newState.disabled = true
        }
        return newState
    }

    _selectionIsWhitespace(selection) {
        // selection.getDocument throws an error when the selection is not attached to a document,
        // hence the try/catch
        try {
            const doc = selection.getDocument()
            const selectionTextFull = doc.get(selection.path)
            if (typeof selectionTextFull === 'string') {
                const selectedText = selectionTextFull.substring(selection.start.offset, selection.end.offset)
                return /^\s+$/.test(selectedText)
            }
            else {
                return false
            }
        }
        catch(error) {
            return false
        }
    }

    executeDelete(params) {
        let annos = this._getAnnotationsForSelection(params)
        let anno = annos[0]

        /**
         * Hack to manage link deletion somehow
         * If the selection is at the end of a link, we insert a new SPACE, select that SPACE and
         * use the truncate function to remove the link
         * Then set the select after the link
         */
        if(anno.end.offset === params.selection.end.offset && anno.end.offset === params.selection.start.offset) {
            const sel = params.selection
            params.editorSession.transaction((tx) => {
                tx.insertText(' ')
            })
            params.selection.end.offset = params.selection.end.offset+1
            params.editorSession.setSelection(sel)

            this.executeTruncate(params)

            sel.start.offset = params.selection.end.offset
            params.editorSession.setSelection(sel)

        }
        else {
            super.executeDelete(params)
        }
    }
}

export default LinkCommand

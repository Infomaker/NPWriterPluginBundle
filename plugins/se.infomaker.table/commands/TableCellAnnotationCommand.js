import {AnnotationCommand} from 'substance'
/**
 * Applying annotations to whole table areas requires being able to pass in a transaction
 * to the annotaion command
 */
class TableAnnotationCommand extends AnnotationCommand {

    constructor(...args) {
        super(...args)
    }

    /**
     * The reason we override the execute method is because we want to
     * apply the same kind of transformation for all cells. I.e. If the first cell
     * is already bold (shouldCreate is false), we want to turn off bold for all other cells
     */
    execute(params) {
        let commandState = params.commandState

        if (commandState.disabled) {
            return false
        }
        switch(commandState.mode) {
            case 'create':
            case 'fuse':
            case 'expand':
                if(!params.shouldCreate) { return false }
                return super.execute(params)
            case 'truncate':
            case 'delete':
                if(params.shouldCreate) { return false }
                return super.execute(params)
            default:
                return false
        }
    }

    executeCreate(params) {
        let annos = this._getAnnotationsForSelection(params)
        this._checkPrecondition(params, annos, this.canCreate)
        let editorSession = this._getEditorSession(params)
        let annoData = this.getAnnotationData()
        annoData.type = this.getAnnotationType()
        let anno

        if (params.transaction) {
            anno = params.transaction.annotate(annoData)
        } else {
            editorSession.transaction((tx) => {
                anno = tx.annotate(annoData)
            })
        }
        return {
            mode: 'create',
            anno: anno
        }
    }

    _applyTransform(params, transformFn) {
        let sel = this._getSelection(params)
        if (sel.isNull()) return

        let editorSession = this._getEditorSession(params)
        let result // to store transform result
        editorSession.setSelection(sel)
        if (params.transaction) {
            let out = transformFn(params.transaction, params)
            if (out) result = out.result
            return result
        } else {
            editorSession.transaction(function(tx) {
                let out = transformFn(tx, params)
                if (out) result = out.result
            })
            return result
        }
    }
}

export default TableAnnotationCommand

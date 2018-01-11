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
            console.info('Running no command', 'shouldcreate:', params.shouldCreate)
            return false
        }
        switch(commandState.mode) {
            case 'create':
            case 'fuse':
            case 'expand':
                if(!params.shouldCreate) { return false }
                console.info('Running create command')
                return super.execute(params)
            case 'truncate':
            case 'delete':
                if(params.shouldCreate) { return false }
                console.info('Running delete command')
                return super.execute(params)
            default:
                console.info('Running unknown command', 'shouldcreate:', params.shouldCreate)
                return false
                // super.execute(params)
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

    // getCommandState(params) { // eslint-disable-line
    //     let sel = this._getSelection(params)
    //     // We can skip all checking if a disabled condition is met
    //     // E.g. we don't allow toggling of property annotations when current
    //     // selection is a container selection
    //     if (this.isDisabled(sel)) {
    //         return { disabled: true }
    //     }
    //     let annos = this._getAnnotationsForSelection(params)
    //     let newState = {
    //         disabled: false,
    //         active: false,
    //         mode: null
    //     }

    //     if (typeof params.shouldCreate === 'undefined' || params.shouldCreate) {
    //         if (this.canCreate(annos, sel)) {
    //             console.info('shouldCreate is true, can create')
    //             newState.mode = 'create'
    //             return newState
    //         } else if (this.canFuse(annos, sel)) {
    //             console.info('shouldCreate is true, can fuse')
    //             newState.mode = 'fuse'
    //             return newState
    //         } else if (this.canExpand(annos, sel)) {
    //             console.info('shouldCreate is true, can expand')
    //             newState.mode = 'expand'
    //             return newState
    //         }
    //     }

    //     if (!params.shouldCreate) {
    //         if (this.canTruncate(annos, sel)) {
    //             console.info('shouldCreate is false, can truncate')
    //             newState.active = true
    //             newState.mode = 'truncate'
    //         } else if (this.canDelete(annos, sel)) {
    //             console.info('shouldCreate is false, can delete')
    //             newState.active = true
    //             newState.mode = 'delete'
    //         } else {
    //             console.info('shouldCreate is false, cant do shit')
    //             newState.disabled = true
    //         }
    //     }
    //     console.info('commandstate mode:', newState.mode)
    //     return newState
    // }

}

export default TableAnnotationCommand

import {EditAnnotationCommand} from 'substance'

class EditLinkCommand extends EditAnnotationCommand {

    getCommandState(params) {
        let sel = this._getSelection(params)
        let annos = this._getAnnotationsForSelection(params)
        let newState = {
            disabled: true,
        }
        if (annos.length === 1 && sel.isPropertySelection() ) {
            newState.disabled = false
            newState.node = annos[0]
        }
        return newState
    }

    execute(params) { console.info("Execute pa", params) }

    _getAnnotationsForSelection(params) {
        return params.selectionState.getAnnotationsForType(this.config.nodeType)
    }
}
export default EditLinkCommand
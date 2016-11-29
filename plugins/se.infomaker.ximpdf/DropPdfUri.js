import insertPdfCommand from './insertPdfCommand'
import {DragAndDropHandler} from 'substance'
import {api} from 'writer'

class DropPdfUri extends DragAndDropHandler {
    match(params) {
        return params.type === 'uri' && _isImage(params.uri)
    }

    drop(tx, params) {
        insertPdfCommand(tx, params.uri)
        setTimeout(() => {
            api.editorSession.fileManager.sync()
        }, 300)
    }
}

function _isImage(uri) {
    return uri.indexOf('.pdf') > 0
}

export default DropPdfUri
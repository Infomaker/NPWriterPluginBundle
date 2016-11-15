import insertImage from './insertImage'
import { DragAndDropHandler } from 'substance'
import {api} from 'writer'

// Implements a file drop handler
class DropImageUri extends DragAndDropHandler {
    match(params) {
        return params.type === 'uri' && _isImage(params.uri)
    }

    drop(tx, params) {
        insertImage(tx, params.uri)
        setTimeout(() => {
            api.editorSession.fileManager.sync()
        }, 300)

    }
}

function _isImage(uri) {
    return uri.indexOf('.jpg') > 0 ||
           uri.indexOf('.png') > 0 ||
           uri.indexOf('.gif') > 0
}


export default DropImageUri
import insertImage from './insertImage'
import { DragAndDropHandler } from 'substance'

// Implements a file drop handler
class DropImageFile extends DragAndDropHandler {
    match(params) {
        return params.type === 'uri' && _isImage(params.uri)
    }

    drop(tx, params) {
        insertImage(tx, params.uri)
    }
}

function _isImage(uri) {
    return uri.indexOf('.jpg') ||
           uri.indexOf('.png') ||
           uri.indexOf('.gif')
}


export default DropImageFile
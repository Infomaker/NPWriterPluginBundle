import { lodash } from 'writer'
import insertImage from './insertImage'
import { DragAndDropHandler } from 'substance'

// Implements a file drop handler
class DropImageFile extends DragAndDropHandler {
    match(params) {
        return params.type === 'file' && lodash.startsWith(params.file.type, 'image')
    }

    drop(tx, params) {
        insertImage(tx, {file: params.file})
    }
}

export default DropImageFile
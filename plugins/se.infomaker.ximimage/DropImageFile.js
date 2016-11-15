import startsWith from 'lodash/startsWith'
import insertImage from './insertImage'
import { DragAndDropHandler } from 'substance'

// Implements a file drop handler
class DropImageFile extends DragAndDropHandler {
    match(params) {
        return params.type === 'file' && startsWith(params.file.type, 'image')
    }

    drop(tx, params) {
        insertImage(tx, params.file)
    }
}

export default DropImageFile
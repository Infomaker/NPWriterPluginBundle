import startsWith from 'lodash/startsWith'
import insertXimimageFromFile from './insertXimimageFromFile'
import DragAndDropHandler from '../../ui/DragAndDropHandler'

// Implements a file drop handler
class DropXimimage extends DragAndDropHandler {
    match(params) {
        return params.type === 'file' && startsWith(params.file.type, 'image')
    }

    drop(tx, params) {
        insertXimimageFromFile(tx, params.file)
    }
}

export default DropXimimage
import {api} from 'writer'
import insertPdfCommand from './InsertPdfCommand'
import {DragAndDropHandler} from 'substance'

// Implements a file drop handler
class DropPdfFile extends DragAndDropHandler {
    match(params) {
        return params.type === 'file' && params.file.type === 'application/pdf'
    }

    drop(tx, params) {
        insertPdfCommand(tx, params.file)
        setTimeout(() => {
            api.editorSession.fileManager.sync()
        }, 300)

    }
}

export default DropPdfFile

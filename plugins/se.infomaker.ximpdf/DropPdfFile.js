import {api} from 'writer'
import insertPdfCommand from './InsertPdfCommand'
import removePDFNode from './RemovePDFNode'
import {DragAndDropHandler} from 'substance'

// Implements a file drop handler
class DropPdfFile extends DragAndDropHandler {
    match(params) {
        return params.type === 'file' && params.file.type === 'application/pdf'
    }

    drop(tx, params) {
        const nodeId = insertPdfCommand(tx, params.file)

        setTimeout(() => {
            api.editorSession.fileManager.sync()
                .catch(err => {
                    const silent = (err.type === 'abort')
                    removePDFNode(nodeId, err, silent)
                })
        }, 0)
    }
}

export default DropPdfFile

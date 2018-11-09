import insertPdfCommand from './InsertPdfCommand'
import removePDFNode from './RemovePDFNode'
import {DragAndDropHandler} from 'substance'
import {api} from 'writer'

class DropPdfUri extends DragAndDropHandler {
    match(params) {
        return params.type === 'uri' && _isImage(params.uri)
    }

    drop(tx, params) {
        const nodeId = insertPdfCommand(tx, params.uri)
        setTimeout(() => {
            api.editorSession.fileManager.sync()
                .catch(err => {
                    const silent = (err.type === 'abort')
                    removePDFNode(nodeId, err, silent)
                })
        }, 0)
    }
}

function _isImage(uri) {
    return uri.indexOf('.pdf') > 0
}

export default DropPdfUri
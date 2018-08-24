import {api} from 'writer'
import insertPdfCommand from './InsertPdfCommand'
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
                    this.removeNodesOnUploadFailure(tx, nodeId, [err.message])
                })
        }, 0)
    }

    /**
     * @todo When image cannot be uploaded, the proxy, file node and object node should be removed using the api.
     */
    removeNodesOnUploadFailure(tx, nodeId, errors) {
        try {
            const document = api.editorSession.getDocument()
            const node = document.get(nodeId)

            if (!node) {
                // Node have been removed while uploading by "undo" or user deleting it
                return
            }

            api.ui.showNotification(
                'ximpdf',
                api.getLabel('pdf-error-title'),
                api.getLabel('pdf-upload-error-message')
            )

            const pdfFile = node.pdfFile
            api.document.deleteNode('ximpdf', node)
            
            if (pdfFile) {
                api.editorSession.transaction((tx) => {
                    tx.delete(pdfFile)
                })
            }
        }
        catch (e) {
            errors.push(e.message)
        }
    }
}

export default DropPdfFile

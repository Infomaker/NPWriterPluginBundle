import {api} from 'writer'

/**
 * @todo When image cannot be uploaded, the proxy, file node and object node should be removed using the api.
 */
export default (nodeId, err, silent) => {
    console.warn('Removing PDF node: ', (err.message || err.type))

    try {
        const document = api.editorSession.getDocument()
        const node = document.get(nodeId)

        if (!node) {
            // Node have been removed while uploading by "undo" or user deleting it
            return
        }

        if (!silent) {
            api.ui.showNotification(
                'ximpdf',
                api.getLabel('pdf-error-title'),
                api.getLabel('pdf-upload-error-message')
            )
        }

        const pdfFile = node.pdfFile
        api.document.deleteNode('ximpdf', node)

        if (pdfFile) {
            api.editorSession.transaction((tx) => {
                tx.delete(pdfFile)
            })
        }
    }
    catch (e) {
        console.warn('Could not remove PDF node: ', e)
    }
}
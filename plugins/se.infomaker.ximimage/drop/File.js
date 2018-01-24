import {lodash, api} from 'writer'
import insertImage from '../models/insertImage'
import {DragAndDropHandler} from 'substance'

// Implements a file drop handler
class DropImageFile extends DragAndDropHandler {
    match(params) {
        return params.type === 'file' && lodash.startsWith(params.file.type, 'image')
    }

    drop(tx, params) {
        const nodeId = this.insertImage(tx, params.file)
        setTimeout(() => {
            api.editorSession.fileManager.sync()
                .then(() => {
                    const imageNode = api.editorSession.getDocument().get(nodeId)
                    imageNode.emit('onImageUploaded')
                })
                .catch((err) => {
                    api.ui.showNotification('ximimage', api.getLabel('image-error-title'), api.getLabel('image-upload-error-message'))
                    this.removeNodesOnUploadFailure(tx, nodeId, [err.message])
                })
        }, 0)
    }

    insertImage(tx, file) {
        try {
            return insertImage(tx, file)
        } catch (err) {
            api.ui.showNotification('ximimage', api.getLabel('image-error-title'), api.getLabel('unsupported-image-error-message'))
            return null
        }
    }

    /**
     * @todo When image cannot be uploaded, the proxy, file node and object node should be removed using the api.
     */
    removeNodesOnUploadFailure(tx, nodeId, errors) {
        try {
            const document = api.editorSession.getDocument()
            const node = document.get(nodeId)
            const imageFile = node.imageFile

            api.document.deleteNode('ximimage', node)

            if (imageFile) {
                api.editorSession.transaction((tx) => {
                    tx.delete(imageFile)
                })
            }
        }
        catch (e) {
            errors.push(e.message)
        }
    }
}

export default DropImageFile

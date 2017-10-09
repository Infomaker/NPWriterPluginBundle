import {lodash, api} from "writer";
import insertImage from "../models/insertImage";
import {DragAndDropHandler} from "substance";

// Implements a file drop handler
class DropImageFile extends DragAndDropHandler {
    match(params) {
        return params.type === 'file' && lodash.startsWith(params.file.type, 'image')
    }

    drop(tx, params) {
        let nodeId;
        try {
            nodeId = insertImage(tx, params.file)
        } catch (err) {
            api.ui.showNotification('ximimage', api.getLabel('image-error-title'), api.getLabel('unsupported-image-error-message'))
            return null
        }

        const maxIterations = 500
        const doc = api.editorSession.getDocument()



        let iterations = 0
        let intervalId = setInterval(() => {
            if (doc.get(nodeId)) {
                clearInterval(intervalId)
                this.sync(tx, nodeId)
            }
            else if (iterations++ > maxIterations) {
                console.error('Newly inserted node still not available, BAILING OUT!')
                clearInterval(intervalId)
                this.showErrorNotification(tx, nodeId, 'Failed adding image due to internal transaction state not finishing')
            }
            else {
                console.warn('Newly inserted node not yet availabel, waiting...')
            }
        }, 50)
    }


    sync(tx, nodeId) {
        api.editorSession.fileManager.sync().catch((err) => {
            api.ui.showNotification('ximimage', api.getLabel('image-error-title'), api.getLabel('image-upload-error-message'))
            this.removeNodesOnUploadFailure(tx, nodeId, [err.message])
        })
    }

    showErrorNotification(tx, nodeId, errorMessage) {
        let errors = [errorMessage]
        this.removeNodesOnUploadFailure(tx, nodeId, errors)

        api.ui.showNotification('ximimage', 'Error', errors.join(' - '))
    }

    /**
     * @todo When image cannot be uploaded, the proxy, file node and object node should be removed using the api.
     */
    removeNodesOnUploadFailure(tx, nodeId, errors) {
        try {
            const document = api.editorSession.getDocument(),
                node = document.get(nodeId)

            api.document.deleteNode('ximimage', node)

            const imageFile = node.imageFile
            if (imageFile) {
                api.editorSession.transaction((tx) => {
                    tx.delete(imageFile)
                })
            }
        }
        catch(e) {
            errors.push(e.message)
        }
    }
}

export default DropImageFile

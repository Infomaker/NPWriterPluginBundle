import insertImage from '../models/insertImage'
import {getExtensions} from '../models/ImageTypes'
import {DragAndDropHandler} from 'substance'
import {api} from 'writer'

// Implements a file drop handler
class DropImageUri extends DragAndDropHandler {

    match(params) {
        const isImage = (filename) => getExtensions().some((extension) => filename.includes(extension))

        return params.type === 'uri' && isImage(params.uri)
    }

    drop(tx, params) {
        const uris = api.editorSession.dragManager.dragState.data.uris
        const nodeId = insertImage(tx, params.uri, uris[uris.length - 1] === params.uri)

        setTimeout(() => {
            api.editorSession.fileManager.sync()
                .then(() => {
                    const imageNode = api.editorSession.getDocument().get(nodeId)
                    imageNode.emit('onImageUploaded')
                })
                .catch(() => {
                    // TODO When image cannot be uploaded, the proxy, file node and object node should be removed using the api.
                    const document = api.editorSession.getDocument()
                    const node = document.get(nodeId)
                    const imageFile = node.imageFile

                    if (imageFile) {
                        api.editorSession.transaction((tx) => {
                            tx.delete(imageFile)
                        })
                    }
                    api.document.deleteNode('ximimage', node)
                })
        }, 0)
    }
}

export default DropImageUri

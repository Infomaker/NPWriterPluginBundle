import insertImage from "../models/insertImage";
import {getExtensions} from '../models/ImageTypes'
import {DragAndDropHandler} from "substance";
import {api} from "writer";

// Implements a file drop handler
class DropImageUri extends DragAndDropHandler {

    constructor(...args) {
        super(...args)
    }

    match(params) {
        const isImage = (filename) => getExtensions().some((extension) => filename.includes(extension))

        return params.type === 'uri' && isImage(params.uri)
    }

    drop(tx, params) {
        const nodeId = insertImage(tx, params.uri)

        setTimeout(() => {
            api.editorSession.fileManager.sync()
                .catch(() => {
                    // TODO When image cannot be uploaded, the proxy, file node and object node should be removed using the api.
                    const document = api.editorSession.getDocument()
                    const node = document.get(nodeId),
                        imageFile = node.imageFile

                    if (imageFile) {
                        api.editorSession.transaction((tx) => {
                            tx.delete(imageFile)
                        })
                    }
                    api.document.deleteNode('ximimage', node)
                })
        }, 300)

    }

}

export default DropImageUri

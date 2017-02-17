import {lodash, api} from "writer";
import insertImage from "./insertImage";
import {DragAndDropHandler} from "substance";

// Implements a file drop handler
class DropImageFile extends DragAndDropHandler {
    match(params) {
        return params.type === 'file' && lodash.startsWith(params.file.type, 'image')
    }

    drop(tx, params) {
        const nodeId = insertImage(tx, params.file)
        setTimeout(() => {
            api.editorSession.fileManager.sync()
                .catch((err) => {
                    // TODO When image cannot be uploaded, the proxy, file node and object node should be removed using the api.
                    let errors = [err.message]
                    try {
                        const document = api.editorSession.getDocument()
                        const node = document.get(nodeId),
                            imageFile = node.imageFile
                        api.document.deleteNode('ximimage', node)
                        if (imageFile) {
                            api.editorSession.transaction((tx) => {
                                tx.delete(imageFile)
                            })
                        }
                    }
                    catch(e) {
                        errors.push(e.message)
                    }
                    api.ui.showNotification('ximimage', 'Error', errors.join(' - '))

                })

        }, 300)
    }
}

export default DropImageFile

import insertImage from "./insertImage";
import {DragAndDropHandler} from "substance";
import {api} from "writer";

// Implements a file drop handler
class DropImageUri extends DragAndDropHandler {

    constructor(...args) {
        super(...args)

        this.defaultImageFileextension = ['.jpg', '.jpeg', '.png', '.gif']
    }

    match(params) {
        return params.type === 'uri' && this._isImage(params.uri)
    }

    drop(tx, params) {
        const nodeId = insertImage(tx, params.uri)
        console.log('imageNode', nodeId);
        setTimeout(() => {
            api.editorSession.fileManager.sync()
                .catch((e) => {
                    // TODO When image cannot be uploaded, the proxy, file node and object node should be removed using the api.
                    const document = api.editorSession.getDocument()
                    const node = document.get(nodeId),
                        imageFile = node.imageFile
                    api.document.deleteNode('ximimage', node)
                    if (imageFile) {
                        api.editorSession.transaction((tx) => {
                            tx.delete(imageFile)
                            console.log("Removed file node: " + imageFile)
                        })
                    }
                })
        }, 300)

    }

    /**
     * Check if a given url is an image and hanled by this class
     * @param {string} uri - The dropped URL
     * @returns {boolean|*}
     * @private
     */
    _isImage(uri) {

        // Load allowed filextension from config file
        let fileExtensionsFromConfig = api.getConfigValue('se.infomaker.ximimage', 'imageFileExtension')

        //If no extension specified in config use the default extension, specified in constructor
        if (!fileExtensionsFromConfig) {
            fileExtensionsFromConfig = this.defaultImageFileextension
        }

        // Iterate given extension and return bool if found
        return fileExtensionsFromConfig.some((extension) => {
            return uri.indexOf(extension) > 0
        })

    }


}

export default DropImageUri
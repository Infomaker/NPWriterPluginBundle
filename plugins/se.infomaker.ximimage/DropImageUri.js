import insertImage from './insertImage'
import {DragAndDropHandler} from 'substance'
import {api} from 'writer'

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
        insertImage(tx, params.uri)
        setTimeout(() => {
            api.editorSession.fileManager.sync()
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
        if(!fileExtensionsFromConfig) {
            fileExtensionsFromConfig = this.defaultImageFileextension
        }

        // Iterate given extension and return bool if found
        return fileExtensionsFromConfig.some((extension) => {
            return uri.indexOf(extension) > 0
        })

    }


}

export default DropImageUri
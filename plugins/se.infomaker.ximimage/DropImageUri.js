import insertImage from './insertImage'
import { DragAndDropHandler } from 'substance'
import {api} from 'writer'

// Implements a file drop handler
class DropImageUri extends DragAndDropHandler {
    match(params) {
        if(this.isExistingImageDrop(params)) {
            console.info('Implement support for handle existing image drop', this.getDataFromURL(params.uri))
        }
        return params.type === 'uri' && _isImage(params.uri)
    }

    isExistingImageDrop(params) {
        if(params.uri && params.uri.indexOf('x-im-entity://x-im/image') >= 0) {
            return true
        }
    }

    drop(tx, params) {
        insertImage(tx, params.uri)
        setTimeout(() => {
            api.editorSession.fileManager.sync()
        }, 300)

    }

    getDataFromURL(url) {
        const queryParamKey = 'data='
        const dataPosition = url.indexOf(queryParamKey)
        let encodedData = url.substr(dataPosition + queryParamKey.length, url.length)
        return JSON.parse(window.atob(encodedData))
    }

}

function _isImage(uri) {
    return uri.indexOf('.jpg') > 0 ||
           uri.indexOf('.png') > 0 ||
           uri.indexOf('.gif') > 0
}


export default DropImageUri
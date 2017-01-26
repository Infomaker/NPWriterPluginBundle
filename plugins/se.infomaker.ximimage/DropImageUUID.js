import {DragAndDropHandler} from 'substance'
import {idGenerator} from 'writer'

// Implements a file drop handler
class DropImageUUID extends DragAndDropHandler {
    match(params) {
        if (this.isExistingImageDrop(params)) {
            console.info('Implement support for handle existing image drop', this.getDataFromURL(params.uri))
            return true
        }
        return false
    }

    isExistingImageDrop(params) {
        if (params.uri && params.uri.indexOf('x-im-entity://x-im/image') >= 0) {
            return true
        }
    }

    drop(tx, params) {

        const dropData = this.getDataFromURL(params.uri)

        // Fetch the image
        const uuid = dropData.uuid
        const nodeId = idGenerator()

        if (!dropData.uuid) {
            throw new Error('Unsupported data. UUID must exist')
        }

        const imageFileNode = {
            parentNodeId: nodeId,
            type: 'npfile',
            imType: 'x-im/image',
            uuid: uuid,
            sourceUUID: uuid,
        }

        // Create file node for the image
        let imageFile = tx.create(imageFileNode)

        // Inserts image at current cursor pos
        tx.insertBlockNode({
            id: nodeId,
            type: 'ximimage',
            imageFile: imageFile.id,
            caption: dropData.name,
            alttext: '',
            credit: '',
            alignment: ''
        })

    }

    getDataFromURL(url) {
        const queryParamKey = 'data='
        const dataPosition = url.indexOf(queryParamKey)
        let encodedData = url.substr(dataPosition + queryParamKey.length, url.length)
        return JSON.parse(window.atob(encodedData))
    }

}


export default DropImageUUID

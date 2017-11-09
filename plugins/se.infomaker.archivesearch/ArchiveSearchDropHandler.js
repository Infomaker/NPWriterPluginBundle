import {DragAndDropHandler} from 'substance'
import {idGenerator} from 'writer'

class ArchiveSearchDropHandler extends DragAndDropHandler {

    match(params) {
        return this._isArchiveImageDrop(params)
    }

    /**
     * @param params
     * @returns {Boolean}
     * @private
     */
    _isArchiveImageDrop(params) {
        return params.uri && params.uri.includes('x-im-archive-entity://x-im/image')
    }

    drop(tx, params) {

        const dropData = this._getDataFromURL(params.uri)

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
            caption: dropData.caption,
            alttext: '',
            credit: dropData.author,
            alignment: ''
        })
    }

    /**
     * @param url
     * @returns {object}
     * @private
     */
    _getDataFromURL(url) {
        const [, encodedData] = url.split('data=')
        return JSON.parse(decodeURIComponent(encodedData))
    }

}

export default ArchiveSearchDropHandler
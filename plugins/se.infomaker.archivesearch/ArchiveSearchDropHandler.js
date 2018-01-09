import {DragAndDropHandler} from 'substance'
import {idGenerator, api} from 'writer'
import PropertyMap from '../se.infomaker.ximimage/models/PropertyMap'

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
        return params.uri && params.uri.includes('x-im-archive-url://x-im/image')
    }

    drop(tx, params) {
        const dropData = this._getDataFromURL(params.uri)

        // Fetch the image
        const url = dropData.url
        const nodeId = idGenerator()

        if (!dropData.uuid) {
            throw new Error('Unsupported data. UUID must exist')
        }

        const imageFileNode = {
            parentNodeId: nodeId,
            type: 'npfile',
            imType: 'x-im/image',
            sourceUrl: url
        }

        // Create file node for the image
        const imageFile = tx.create(imageFileNode)
        const propertyMap = PropertyMap.getValidMap()

        // Inserts image at current cursor pos
        tx.insertBlockNode({
            id: nodeId,
            type: 'ximimage',
            imageFile: imageFile.id,
            alignment: '',
            caption: propertyMap.caption !== false ? dropData[propertyMap.caption] : '',
            alttext: propertyMap.alttext !== false ? dropData[propertyMap.alttext] : '',
            credit: propertyMap.credit !== false ? dropData[propertyMap.credit] : ''
        })

        setTimeout(() => {
            api.editorSession.fileManager.sync()
                .then(() => {
                    const imageNode = api.editorSession.getDocument().get(nodeId)
                    imageNode.emit('onImageUploaded')
                })
                .catch(() => {
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

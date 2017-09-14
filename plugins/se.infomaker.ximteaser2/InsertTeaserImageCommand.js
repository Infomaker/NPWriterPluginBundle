import {documentHelpers} from 'substance'
import {WriterCommand, idGenerator, api} from 'writer'

class InsertTeaserImageCommand extends WriterCommand {

    execute(params, context) {
        const activeTeaserNode = context.doc.get(params.data.activeTeaserId)
        const {imageEntity, tx} = params.data
        const imageEntityType = this._getImageEntityType(imageEntity)

        if (imageEntityType === 'file') {
            // Handle file drop or upload
            this.handleNewImage(tx, imageEntity, activeTeaserNode, context)
        } else if (imageEntityType === 'node') {
            // Handle internal node drag
            this.handleNodeDrop(tx, imageEntity, activeTeaserNode, context)
        } else if (imageEntityType === 'uri') {
            // Handles uri drop from related content
            const uri = imageEntity.data.uris[0]
            const dropData = this._getDataFromURL(uri)
            this.handleUriDrop(tx, dropData, activeTeaserNode)
        } else if (imageEntityType === 'url') {
            // Handles external URL drops
            const url = imageEntity.data.uris[0]
            if (this._isImage(url)) {
                this.handleUrlDrop(tx, url, activeTeaserNode)
                setTimeout(() => {
                    api.editorSession.fileManager.sync()
                }, 300)
            }
        }

        return imageEntityType
    }

    _getImageEntityType(imageEntity) {
        if (this._isFileDropOrUpload(imageEntity.data)) {
            return 'file'
        } else if (imageEntity.nodeDrag) {
            return 'node'
        } else if (this._isUriDrop(imageEntity.data)) {
            return 'uri'
        } else if (this._isUrlDrop(imageEntity.data)) {
            return 'url'
        }
    }

    _isImage(uri) {
        // Load allowed filextension from config file
        const fileExtensionsFromConfig = api.getConfigValue('se.infomaker.ximimage', 'imageFileExtension', ['jpeg', 'jpg', 'gif', 'png'])

        // Iterate given extension and return bool if found
        return fileExtensionsFromConfig.some((extension) => uri.includes(extension))
    }

    _getDataFromURL(url) {
        const queryParamKey = 'data='
        const dataPosition = url.indexOf(queryParamKey)
        if(dataPosition > -1) {
            let encodedData = url.substr(dataPosition + queryParamKey.length, url.length)
            return JSON.parse(decodeURIComponent(encodedData))
        } else {
            return false
        }
    }

    /**
     * This handles drops of nodes of type ximimage.
     * It retrieves the imageNode and extracts that fileNode and make a copy of it
     * The crops is removed, uri is changed to used to one from the ImageNode
     * The imageFile.id
     *
     * @param tx
     * @param dragState
     * @param teaserNode
     * @param context
     */
    handleNodeDrop(tx, dragState, teaserNode, context) {
        if (dragState.sourceSelection) {
            try {
                const draggedNodeId = dragState.sourceSelection.nodeId
                const doc = context.editorSession.getDocument()
                const draggedNode = doc.get(draggedNodeId)
                if (draggedNode && draggedNode.type === 'ximimage') {
                    const imageFile = draggedNode.imageFile
                    const imageNode = doc.get(imageFile)
                    const newFileNode = documentHelpers.copyNode(imageNode)[0]
                    newFileNode.parentNodeId = teaserNode.id
                    delete newFileNode.id
                    let imageFileNode = tx.create(newFileNode)
                    tx.set([teaserNode.id, 'imageFile'], imageFileNode.id)
                    tx.set([teaserNode.id, 'uri'], draggedNode.uri)
                    tx.set([teaserNode.id, 'crops'], [])
                    tx.set([teaserNode.id, 'height'], draggedNode.height)
                    tx.set([teaserNode.id, 'width'], draggedNode.width)
                }
            } catch (_) {

            }
        }
    }

    /**
     * @param tx
     * @param dropData
     * @param teaserNode
     */
    handleUriDrop(tx, dropData, teaserNode) {
        teaserNode.shouldDownloadMetadataForImageUri = true // ?
        // Fetch the image
        const uuid = dropData.uuid

        if (!dropData.uuid) {
            throw new Error('Unsupported data. UUID must exist')
        }

        const imageFileNode = {
            parentNodeId: teaserNode.id,
            type: 'npfile',
            imType: 'x-im/image',
            uuid: uuid,
            sourceUUID: uuid,
        }

        // Create file node for the image
        let imageFile = tx.create(imageFileNode)

        tx.set([teaserNode.id, 'imageFile'], imageFile.id)

    }

    /**
     * @param tx
     * @param url
     * @param teaserNode
     */
    handleUrlDrop(tx, url, teaserNode) {
        const nodeId = idGenerator()

        const imageFileNode = {
            parentNodeId: teaserNode.id,
            type: 'npfile',
            imType: 'x-im/image'
        }
        imageFileNode['sourceUrl'] = url

        // Create file node for the image
        let imageFile = tx.create(imageFileNode)

        tx.set([teaserNode.id, 'imageFile'], imageFile.id)

        return nodeId
    }

    /**
     * This method is used when a file is dropped on top of the teaser
     * It will create a fileNode and update the teasernode with
     * the filenode property, all done in a provided transaction
     * @param tx
     * @param dragState
     * @param teaserNode
     * @param context
     */
    handleNewImage(tx, dragState, teaserNode, context) {
        const file = dragState.data.files[0] // Teaser only supports one image, take the first one
        // TODO: we need to get the file instance through to the
        // real document
        let imageFile = tx.create({
            parentNodeId: teaserNode.id,
            type: 'npfile',
            imType: 'x-im/image',
            mimeType: file.type,
            sourceFile: file
        })

        tx.set([teaserNode.id, 'imageFile'], imageFile.id)
        // HACK: fileUpload will be done by CollabSession
        setTimeout(() => {
            context.editorSession.fileManager.sync()
        }, 300)
    }

    _isFileDropOrUpload(dragData) {
        return dragData.files && dragData.files.length > 0
    }

    _isUrlDrop(dragData) {
        return dragData.uris && dragData.uris.length > 0 && /^https?:\/\//.test(dragData.uris[0])
    }

    _isUriDrop(dragData) {
        return dragData.uris && dragData.uris.length > 0 && dragData.uris[0].includes('x-im-entity://x-im/image')
    }
}

export default InsertTeaserImageCommand
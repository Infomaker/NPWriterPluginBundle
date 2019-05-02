import {documentHelpers} from 'substance'
import {WriterCommand, api} from 'writer'

class InsertTeaserImageCommand extends WriterCommand {

    /**
     * Handles insertion of image in a teaser node. If the insert happens
     * at the same time as a transaction, that transaction needs to be supplied to
     * the command. If not, it can be omitted.
     *
     * @param params
     * @param context
     */
    execute(params, context) {
        if(params.tx) {
            this._handleInsert(params.tx, params)
        } else {
            context.editorSession.transaction((tx) => this._handleInsert(tx, params))
        }
    }

    _handleInsert(tx, params) {
        const activeTeaserNode = params.context.node
        const {data} = params
        let imageFileNode

        switch(data.type) {
            case 'file':
                imageFileNode = this._insertFileImage(tx, data.file, activeTeaserNode)
                break
            case 'node':
                imageFileNode = this._insertNodeImage(tx, data.nodeId, activeTeaserNode)
                break
            case 'uri':
                imageFileNode = this._insertUriImage(tx, data.uriData, activeTeaserNode)
                break
            case 'url':
                imageFileNode = this._insertUrlImage(tx, data.url, activeTeaserNode)
                break
            default:
                break
        }

        // timeout to wait for substance execution to finish
        setTimeout(() => {
            const es = api.editorSession

            es.fileManager.sync()
                .then(() => {
                    activeTeaserNode.emit('onImageUploaded')
                })
                .catch(() => {
                    // Error is dealt with lower down, now is the time to clear everything
                    if (imageFileNode) {
                        es.transaction(tx => {
                            tx.set([activeTeaserNode.id, 'imageFile'], null)
                            tx.set([activeTeaserNode.id, 'crops'], [])

                            for (var proxyId in es.fileManager.proxies) {
                                if (proxyId === imageFileNode.id) {
                                    tx.delete(imageFileNode.id)
                                    delete(es.fileManager.proxies[proxyId])
                                }
                            }
                        })
                    }
                })
        }, 0)
    }

    /**
     * This handles drops of nodes of type ximimage.
     * It retrieves the imageNode and extracts that fileNode and make a copy of it
     * The crops is removed, uri is changed to used to one from the ImageNode
     * The imageFile.id
     *
     * @param tx
     * @param draggedNodeId
     * @param teaserNode
     */
    _insertNodeImage(tx, draggedNodeId, teaserNode) {
        try {
            const doc = api.editorSession.getDocument()
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
                tx.set([teaserNode.id, 'imageUuid'], draggedNode.uuid)
                tx.set([teaserNode.id, 'crops'], [])
                tx.set([teaserNode.id, 'height'], draggedNode.height)
                tx.set([teaserNode.id, 'width'], draggedNode.width)

                return imageFileNode
            }
        } catch (_) {
            return null
        }
    }

    /**
     * @param tx
     * @param uriData
     * @param teaserNode
     */
    _insertUriImage(tx, uriData, teaserNode) {
        // Fetch the image
        const {uuid, url} = uriData

        if (!url && !uuid) {
            throw new Error('Unsupported data. UUID or URL must exist')
        }

        const imageFileNode = {
            parentNodeId: teaserNode.id,
            type: 'npfile',
            imType: 'x-im/image'
        }

        if(url) {
            imageFileNode.sourceUrl = url
        } else if(uuid) {
            imageFileNode.uuid = uuid
            imageFileNode.sourceUUID = uuid
        }

        // Create file node for the image
        let imageFile = tx.create(imageFileNode)

        tx.set([teaserNode.id, 'imageFile'], imageFile.id)
        tx.set([teaserNode.id, 'crops'], [])

        return imageFile
    }

    /**
     * @param tx
     * @param url
     * @param teaserNode
     */
    _insertUrlImage(tx, url, teaserNode) {
        const imageFileNode = {
            parentNodeId: teaserNode.id,
            type: 'npfile',
            imType: 'x-im/image'
        }
        imageFileNode['sourceUrl'] = url

        // Create file node for the image
        let imageFile = tx.create(imageFileNode)

        tx.set([teaserNode.id, 'imageFile'], imageFile.id)
        tx.set([teaserNode.id, 'crops'], [])

        return imageFile
    }

    /**
     * This method is used when a file is dropped on top of the teaser
     * It will create a fileNode and update the teasernode with
     * the filenode property, all done in a provided transaction
     * @param tx
     * @param file
     * @param teaserNode
     */
    _insertFileImage(tx, file, teaserNode) {
        // TODO: we need to get the file instance through to the real document
        let imageFile = tx.create({
            parentNodeId: teaserNode.id,
            type: 'npfile',
            imType: 'x-im/image',
            mimeType: file.type,
            sourceFile: file
        })

        tx.set([teaserNode.id, 'imageFile'], imageFile.id)
        tx.set([teaserNode.id, 'crops'], [])

        return imageFile
    }
}

export default InsertTeaserImageCommand

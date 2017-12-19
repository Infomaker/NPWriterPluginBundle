import {documentHelpers} from 'substance'
import {WriterCommand, api, idGenerator} from 'writer'

class InsertImageCommand extends WriterCommand {

    execute(params, context) {
        if (params.tx) {
            this.handleInsert(params.tx, params)
        } else {
            context.editorSession.transaction((tx) => this.handleInsert(tx, params))
        }
    }

    /**
     * @private
     * @memberof InsertImageCommand
     */
    handleInsert(tx, params) {
        const imageGalleryNode = params.context.node
        const {data} = params
        const createdImageNodes = []
        const fileManager = api.editorSession.fileManager

        switch (data.type) {
            case 'file':
                createdImageNodes.push(...this._insertFiles(tx, data.files, imageGalleryNode))
                break
            case 'node':
                createdImageNodes.push(...this._insertNode(tx, data.nodeId, imageGalleryNode))
                break
            case 'uri':
                createdImageNodes.push(...this._insertUri(tx, data.uriData, imageGalleryNode))
                break
            case 'url':
                createdImageNodes.push(...this._insertUrl(tx, data.url, imageGalleryNode))
                break
            default:
                break
        }

        // Wait for substance operations before syncing files
        setTimeout(() => {
            fileManager.sync().then(() => {
                api.events.triggerEvent(null, 'image-gallery:imagesAdded', {
                    imageNodes: createdImageNodes
                })
            })
        }, 0)
    }

    /**
     *
     * @param tx
     * @param files
     * @param node
     * @private
     */
    _insertFiles(tx, files, node) {
        const imageGalleryImageNodes = files.map((file) => {
            const imageId = idGenerator()
            const imageGalleryImage = tx.create({
                parentNodeId: node.id,
                type: 'imagegalleryimage'
            })
            const imageFile = tx.create({
                id: imageId,
                parentNodeId: imageGalleryImage.id,
                type: 'npfile',
                imType: 'x-im/image',
                mimeType: file.type,
                sourceFile: file
            })

            tx.set([imageGalleryImage.id, 'imageFile'], imageFile.id)

            return imageGalleryImage
        })

        tx.set([node.id, 'nodes'], [...node.nodes, ...imageGalleryImageNodes.map(({id}) => id)])

        return imageGalleryImageNodes
    }

    /**
     *
     * @param tx
     * @param draggedNodeId
     * @param imageGalleryNode
     * @private
     */
    _insertNode(tx, draggedNodeId, imageGalleryNode) {
        try {
            const doc = api.editorSession.getDocument()
            const draggedNode = doc.get(draggedNodeId)
            if (draggedNode && draggedNode.type === 'ximimage') {

                const imageFile = draggedNode.imageFile
                const imageNode = doc.get(imageFile)
                const newFileNode = documentHelpers.copyNode(imageNode)[0]
                newFileNode.parentNodeId = imageGalleryNode.id

                delete newFileNode.id

                let imageFileNode = tx.create(newFileNode)

                const galleryImageNode = tx.create({
                    parentNodeId: imageGalleryNode.id,
                    type: 'imagegalleryimage',
                    imageFile: imageFileNode.id
                })

                tx.set([imageGalleryNode.id, 'nodes'], [...imageGalleryNode.nodes, galleryImageNode.id])

                return [galleryImageNode]
            }
        } catch (_) {

        }
    }

    /**
     *
     * @param tx
     * @param uriData
     * @param imageGalleryNode
     * @private
     */
    _insertUri(tx, uriData, imageGalleryNode) {

        const {uuid, url} = uriData

        if (!url && !uuid) {
            throw new Error('Unsupported data. UUID or URL must exist')
        }

        const imageFileNode = {
            parentNodeId: imageGalleryNode.id,
            type: 'npfile',
            imType: 'x-im/image'
        }

        if (url) {
            imageFileNode.sourceUrl = url
        } else if (uuid) {
            imageFileNode.uuid = uuid
            imageFileNode.sourceUUID = uuid
        }

        // Create file node for the image
        let imageFile = tx.create(imageFileNode)

        const galleryImageNode = tx.create({
            parentNodeId: imageGalleryNode.id,
            type: 'imagegalleryimage',
            imageFile: imageFile.id
        })

        tx.set([imageGalleryNode.id, 'nodes'], [...imageGalleryNode.nodes, galleryImageNode.id])

        return [galleryImageNode]
    }

    /**
     * @param tx
     * @param url
     * @param imageGalleryNode
     * @private
     */
    _insertUrl(tx, url, imageGalleryNode) {
        const imageFileNode = {
            parentNodeId: imageGalleryNode.id,
            type: 'npfile',
            imType: 'x-im/image',
            sourceUrl: url
        }

        // Create file node for the image
        let imageFile = tx.create(imageFileNode)

        const galleryImageNode = tx.create({
            parentNodeId: imageGalleryNode.id,
            type: 'imagegalleryimage',
            imageFile: imageFile.id
        })

        tx.set([imageGalleryNode.id, 'nodes'], [...imageGalleryNode.nodes, galleryImageNode.id])

        return [galleryImageNode]
    }
}

export default InsertImageCommand

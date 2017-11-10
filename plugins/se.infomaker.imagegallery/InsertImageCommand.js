import {documentHelpers} from 'substance'
import {WriterCommand, api, idGenerator} from 'writer'

class InsertImageCommand extends WriterCommand {
    
    execute(params, context) {
        if(params.tx) {
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

        switch(data.type) {
            case 'file':
                this._insertFiles(tx, data.files, imageGalleryNode)
                break
            case 'node':
                this._insertNode(tx, data.nodeId, imageGalleryNode)
                break
            case 'uri':
                this._insertUri(tx, data.uriData, imageGalleryNode)
                break
            case 'url':
                this._insertUrl(tx, data.url, imageGalleryNode)
                break
            default:
                break
        }
    }

    /**
     *
     * @param tx
     * @param files
     * @param node
     * @private
     */
    _insertFiles(tx, files, node) {
        const imageGalleryImages = []

        files.forEach((file) => {
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

            imageGalleryImages.push(imageGalleryImage.id)
            tx.set([imageGalleryImage.id, 'imageFile'], imageFile.id)
        })

        tx.set([node.id, 'nodes'], [...node.nodes, ...imageGalleryImages])

        setTimeout(() => {
            api.editorSession.fileManager.sync()
        }, 300)
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
        const uuid = uriData.uuid

        if (!uriData.uuid) {
            throw new Error('Unsupported data. UUID must exist')
        }

        const imageFileNode = {
            parentNodeId: imageGalleryNode.id,
            type: 'npfile',
            imType: 'x-im/image',
            uuid: uuid,
            sourceUUID: uuid,
        }

        // Create file node for the image
        let imageFile = tx.create(imageFileNode)

        const galleryImageNode = tx.create({
            parentNodeId: imageGalleryNode.id,
            type: 'imagegalleryimage',
            imageFile: imageFile.id
        })

        tx.set([imageGalleryNode.id, 'nodes'], [...imageGalleryNode.nodes, galleryImageNode.id])
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

        setTimeout(() => {
            api.editorSession.fileManager.sync()
        }, 300)
    }
}

export default InsertImageCommand
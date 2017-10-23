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
        const {files} = data
        const imageFiles = []
        const imageGalleryImages = []
        const imageId = idGenerator()
        
        files.forEach(file => {
            let imageFile = tx.create({
                id: imageId,
                parentNodeId: imageGalleryNode.id,
                type: 'npfile',
                imType: 'x-im/image',
                mimeType: file.type,
                sourceFile: file
            })
            let imageGalleryImage = tx.create({
                id: `${imageId}-galleryImage`,
                parentNodeId: imageGalleryNode.id,
                type: 'imagegalleryimage',
            })
            imageFiles.push(imageFile.id)
            imageGalleryImages.push(imageGalleryImage.id)
        })

        tx.set([imageGalleryNode.id, 'imageFiles'], [...imageGalleryNode.imageFiles, ...imageFiles])
        tx.set([imageGalleryNode.id, 'nodes'], [...imageGalleryNode.nodes, ...imageGalleryImages])

        setTimeout(() => {
            debugger
            tx.setSelection({
                type: 'node',
                path: imageGalleryNode.document.get(imageGalleryNode.id).getContentPath(),
                startOffset: 0,
                surfaceId: imageGalleryNode.id
            })
            api.editorSession.fileManager.sync()
        }, 300)
    }
}

export default InsertImageCommand
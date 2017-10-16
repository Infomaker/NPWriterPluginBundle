import {WriterCommand, api} from 'writer'

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
        const imageFiles = imageGalleryNode.imageFiles || []

        files.forEach(file => {
            let imageFile = tx.create({
                parentNodeId: imageGalleryNode.id,
                type: 'npfile',
                imType: 'x-im/image',
                mimeType: file.type,
                sourceFile: file
            })
            imageFiles.push(imageFile.id)
        })

        tx.set([imageGalleryNode.id, 'imageFiles'], imageFiles)
        setTimeout(() => {
            api.editorSession.fileManager.sync()
        }, 300)
    }
}

export default InsertImageCommand
import {WriterCommand, api, idGenerator} from 'writer'

class XimteaserInsertImageCommand extends WriterCommand {

    constructor(...args) {
        super(...args)
        this.name = 'ximteaserinsertimage'
    }

    execute(params, context) {

        const teaserNode = params.context.node
        const editorSession = context.editorSession
        const doc = editorSession.getDocument()
        const file = params.data[0] // Teaser only supports one image, take the first one

        editorSession.transaction((tx) => {
            // Create file node for the image
            let imageFile = tx.create({
                imageNodeId: teaserNode.id,
                type: 'ximimagefile',
                fileType: 'image',
                mimeType: file.type,
                sourceFile: file
            })

            doc.set([teaserNode.id, 'imageFile'], imageFile.id)
            console.log("ImageFile", imageFile);


        })


    }
}
export default XimteaserInsertImageCommand
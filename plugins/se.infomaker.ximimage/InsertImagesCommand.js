import insertImage from './models/insertImage'
import {api, WriterCommand} from 'writer'

/*
    Insert multiple images based on a list of image files
*/
class XimimageCommand extends WriterCommand {

    execute(params) {
        let nodeIds = []
        params.editorSession.transaction((tx) => {
            nodeIds = Array.prototype.map.call(params.files, file => insertImage(tx, file))
        })

        api.editorSession.fileManager.sync()
            .then(() => {
                nodeIds.forEach(nodeId => {
                    const imageNode = api.editorSession.getDocument().get(nodeId)
                    imageNode.emit('onImageUploaded')
                })
            })
            .catch(() => {
                const document = api.editorSession.getDocument()

                nodeIds.forEach(nodeId => {
                    const node = document.get(nodeId)
                    const imageFile = node.imageFile

                    if (imageFile) {
                        api.editorSession.transaction((tx) => {
                            tx.delete(imageFile)
                        })
                    }
                    api.document.deleteNode('ximimage', node)
                })
            })

        return true;
    }
}

export default XimimageCommand

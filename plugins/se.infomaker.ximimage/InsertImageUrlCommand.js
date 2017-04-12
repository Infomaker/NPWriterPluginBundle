import insertImage from './insertImage'
import {api, WriterCommand} from 'writer'

/*

 */
class InsertImageUrlCommand extends WriterCommand {

    execute(params) {
        if (params.isPaste) {
            const currentNode = params.selection.getPath()
            if(!currentNode) {
                return false
            }
            const doc = params.editorSession.getDocument()
            api.document.deleteNode('ximimage', doc.get(currentNode[0]))
        }

        api.editorSession.transaction((tx) => {
            const nodeId = insertImage(tx, params.imageUrl)

            setTimeout(() => {
                api.editorSession.fileManager.sync()
                    .catch(() => {
                        // TODO When image cannot be uploaded, the proxy, file node and object node should be removed using the api.
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
            }, 300)
        })
    }

}

export default InsertImageUrlCommand

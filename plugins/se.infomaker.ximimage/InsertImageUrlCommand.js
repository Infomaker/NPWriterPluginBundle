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
            api.document.deleteNode('socialembed', doc.get(currentNode[0]))
        }
        api.editorSession.transaction((tx) => {
            insertImage(tx, params.imageUrl)
        })
        api.editorSession.fileManager.sync()

    }
}

export default InsertImageUrlCommand

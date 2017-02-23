import { WriterCommand, api } from 'writer'
import insertEmbed from './insertEmbed'

class SocialembedCommand extends WriterCommand {

    execute(params) {

        if (params.isPaste) {
            const currentNode = params.selection.getPath()
            if(!currentNode) {
                return false
            }
            const doc = params.editorSession.getDocument()
            api.document.deleteNode('socialembed', doc.get(currentNode[0]))
        }

        params.editorSession.transaction((tx) => {
            insertEmbed(tx, params.url)
        })

        return true
    }
}

export default SocialembedCommand
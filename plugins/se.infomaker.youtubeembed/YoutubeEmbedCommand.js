import {WriterCommand, api} from 'writer'
import insertEmbed from './insertEmbed'

class YoutubeEmbedCommand extends WriterCommand {


    execute(params) {

        if (params.isPaste) {
            const currentNode = params.selection.getPath()
            if(!currentNode) {
                return false
            }
            const currentNodeId = currentNode[0]
            const previousNode = api.document.getPreviousNode(currentNodeId)
            api.document.deleteNode('youtubeembed', previousNode)
        }

        params.editorSession.transaction((tx) => {
            insertEmbed(tx, params.url)
        })
        return true
    }

}

export default YoutubeEmbedCommand
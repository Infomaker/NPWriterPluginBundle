import { WriterCommand } from 'writer'
import insertEmbed from './insertEmbed'

class YoutubeEmbedCommand extends WriterCommand {


    execute(params) {
        params.editorSession.transaction((tx) => {
            insertEmbed(tx, params.url)
        })
        return true
    }

}

export default YoutubeEmbedCommand
import { Command } from 'substance'
import insertEmbed from './insertEmbed'

class YoutubeEmbedCommand extends Command {

    getCommandState(params) {
        return {
            disabled: params.surface ? false : true
        }
    }

    execute(params) {
        params.editorSession.transaction((tx) => {
            insertEmbed(tx, params.url)
        })
        return true
    }

}

export default YoutubeEmbedCommand
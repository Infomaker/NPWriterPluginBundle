import {Command} from 'substance'
import YoutubeEmbedEditTool from './YoutubeEmbedEditTool'
import {api} from 'writer'

class YoutubeEmbedCommand extends Command {

    getCommandState() {
        return {
            disabled: false
        }
    }

    execute() {
        api.ui.showDialog(YoutubeEmbedEditTool, {}, {title: 'insert-youtube-id'})
        console.log("Execute youtube command")
    }

}

export default YoutubeEmbedCommand
import {Command} from 'substance'
import {api} from 'writer'

class YoutubeEmbedEditCommand extends Command {

    getCommandState() {
        return {
            disabled: false
        }
    }

    execute(params) {
        var data = {
            dataType: 'x-im/youtube',
            url: params.url,
            uri: "",
            type: 'youtubeembed',
            linkType: 'x-im/youtube',
            html: "",
        }

        api.document.insertBlockNode(data.type, data)
    }

}

export default YoutubeEmbedEditCommand
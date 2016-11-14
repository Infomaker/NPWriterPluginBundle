import { Command } from 'substance'
import { insertEmbed } from './insertEmbed'

class SocialembedCommand extends Command {

    getCommandState() {
        return { disabled: false }
    }

    execute(params) {
        params.documentSession.transaction((tx) => {
            insertEmbed(tx, params.url)
        })
        return true
    }
}

export default SocialembedCommand
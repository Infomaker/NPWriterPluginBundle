import {WriterCommand, api} from 'writer'
import OpenEmbedDialog from './openEmbedDialog'

class HtmlembedCommand extends WriterCommand {

    execute(params) {

        OpenEmbedDialog({})

    }
}

export default HtmlembedCommand
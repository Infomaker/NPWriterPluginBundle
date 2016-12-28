import {WriterCommand} from 'writer'
import OpenEmbedDialog from './openEmbedDialog'

class HtmlembedCommand extends WriterCommand {
    execute() {
        OpenEmbedDialog({})
    }
}

export default HtmlembedCommand

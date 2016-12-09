import {WriterCommand, api} from 'writer'

class HtmlembedCommand extends WriterCommand {

    execute(params) {

        const data = {
            type: 'htmlembed',
            dataType: 'x-im/htmlembed',
            text: params.text,
            format: 'html',
        }

        return api.document.insertBlockNode(data.type, data);
    }
}

export default HtmlembedCommand
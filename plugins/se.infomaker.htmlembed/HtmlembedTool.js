import {Component, Tool} from 'substance'
import HtmlembedEditTool from './HtmlembedEditTool'
import {api} from 'writer'

class HtmlembedTool extends Tool {

    insertEmbedhtml() {

        api.editorSession.executeCommand('htmlembed', {

        })

        // api.ui.showDialog(
        //     HtmlembedEditTool,
        //     {
        //         myProps: 'Insert HTML'
        //     },
        //     {
        //         title: "Embed HTML"
        //     }
        // );
    }

    render($$) {

        const el = $$('button')
            .attr('title', this.getLabel('Insert HTML embed'))
            .addClass('se-tool')
            .append($$('i').addClass('fa fa-code'))
            .on('click', this.insertEmbedhtml);

        return el
    }

}
export default HtmlembedTool
import {api} from 'writer'
import HtmlembedEditTool from './HtmlembedEditTool'

export default (props) => {
    api.ui.showDialog(
        HtmlembedEditTool,
        props,
        {
            title: "Embed HTML",
            cssClass: 'im-htmlembed-modal hide-overflow'
        }
    );
}

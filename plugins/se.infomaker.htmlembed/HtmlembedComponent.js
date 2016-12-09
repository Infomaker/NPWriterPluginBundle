import {Component, FontAwesomeIcon, TextPropertyEditor} from 'substance'
import {api} from 'writer'
import HtmlembedEditTool from './HtmlembedEditTool'

class HtmlembedComponent extends Component {

    didMount() {
        this.resize()
        this.el.el.focus()
        this.el.el.addEventListener('paste', (e) => {
            console.log("Paste", e);
        })
        // observe(text, 'cut',/**/     delayedResize);
        // observe(text, 'paste',   delayedResize);
        // observe(text, 'drop',    delayedResize);
    }

    render($$) {
        const el = $$('div').addClass('im-blocknode__container im-htmlembed')

        el.append(this.renderHeader($$))
        el.append(this.renderContent($$))

        return el;
    }

    renderHeader($$) {
        return $$('div')
            .append([
                $$(FontAwesomeIcon, {icon: 'fa-code'}),
                $$('strong').append(this.getLabel('HTML Embed')).attr('contenteditable', false),

                $$('span').addClass('edit-button').append(
                    $$(FontAwesomeIcon, {icon: 'fa-pencil-square-o'})
                ).on('click', this.editEmbedhtml).attr('title', this.getLabel('Edit'))

            ])
            .addClass('header')
            .attr('contenteditable', false)
    }

    renderContent($$) {
        const content = $$('div').ref('embedContent')
            .addClass('im-blocknode__content full-width')

        const textarea = $$('textarea')
            .addClass('html-embed-content')
            .on('change', this.htmlChanged)
            .on('keydown', this.resize)
            .ref('htmlarea')
            .val(this.props.node.text)

        content.append(textarea)

        return content
    }

    didUpdate() {
        console.log("Did update");
        this.el.el.focus()
        this.resize()
    }

    resize() {
        const htmlTexarea = this.refs.htmlarea.el.el

        htmlTexarea.style.height = 'auto'
        htmlTexarea.style.height = htmlTexarea.scrollHeight+'px'
    }

    htmlChanged(e) {
        const editorSession = api.editorSession

        editorSession.transaction((tx) => {
            tx.set([this.props.node.id, 'text'], this.refs.htmlarea.val())
        })
    }

    removeEmbedhtml() {

        api.document.deleteNode('htmlembed', this.props.node);
    }

    editEmbedhtml() {
        api.ui.showDialog(
            HtmlembedEditTool,
            {
                text: this.props.node.text,
                update: this.updateHTMLOnNode.bind(this)
            },
            {
                title: "Embed HTML"
            }
        );
    }

    updateHTMLOnNode(html) {
        api.editorSession.transaction((tx) => {
            tx.set([this.props.node.id, 'text'], html);
        })
        // this.rerender()
    }

}

export default HtmlembedComponent
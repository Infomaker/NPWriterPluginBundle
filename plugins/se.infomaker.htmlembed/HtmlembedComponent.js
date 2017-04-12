import {Component, FontAwesomeIcon, TextPropertyComponent} from 'substance'
import {api} from 'writer'
import OpenEmbedDialog from './openEmbedDialog'
class HtmlembedComponent extends Component {

    render($$) {
        const el = $$('div').addClass('im-blocknode__container im-htmlembed')

        el.append(this.renderHeader($$))
        el.append(this.renderContent($$))

        return el;
    }

    grabFocus() {
        this.editEmbedhtml()
    }

    renderHeader($$) {
        return $$('div')
            .append([
                $$(FontAwesomeIcon, {icon: 'fa-code'}),
                $$('strong').append(this.getLabel('HTML Embed')).attr('contenteditable', false),

                $$('span').addClass('edit-button')
                    .append(
                        $$(FontAwesomeIcon, {icon: 'fa-pencil-square-o'})
                    )
                    .on('click', this.editEmbedhtml).attr('title', this.getLabel('Edit embed code'))

            ])
            .addClass('header')
            .attr('contenteditable', false)
    }

    renderContent($$) {
        const content = $$('div').ref('embedContent')
            .addClass('im-blocknode__content')

        const textarea = $$(TextPropertyComponent, {
            tagName: 'div',
            path: [this.props.node.id, 'text']
        })
        textarea.ref('htmlarea')
        textarea.append(this.props.node.text)
        textarea.on('dblclick', () => {
            this.editEmbedhtml()
        })

        content.append(textarea)

        return content
    }


    editEmbedhtml() {

        const props = {
            text: this.props.node.text,
            update: this.updateHTMLOnNode.bind(this)
        }
        OpenEmbedDialog(props)
    }

    updateHTMLOnNode(html) {
        api.editorSession.transaction((tx) => {
            tx.set([this.props.node.id, 'text'], html);
        })
        this.rerender()
    }

}

export default HtmlembedComponent

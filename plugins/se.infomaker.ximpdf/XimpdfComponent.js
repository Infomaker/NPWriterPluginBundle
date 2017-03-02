import {Component, TextPropertyEditor, FontAwesomeIcon} from 'substance'
import {api} from 'writer'

class XimpdfComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    _onDocumentChange(change) {
        if (change.isAffected(this.props.node.id) ||
            change.isAffected(this.props.node.pdfFile)) {
            this.rerender()
        }
    }

    grabFocus() {
        let text = this.refs.text
        if(text) {
            const textLength = text.textContent.length // To set selection at the end of the text field
            this.context.editorSession.setSelection({
                type: 'property',
                path: text.getPath(),
                startOffset: textLength
            })
        }

    }
    render($$) {
        const doc = api.doc
        const node = this.props.node
        const fileNode = doc.get(node.pdfFile)
        const el = $$('div').addClass('im-blocknode__container ximpdf__container')
        const textEditor = $$(TextPropertyEditor, {
            tagName: 'div',
            path: [this.props.node.id, 'text'],
            doc: this.props.doc
        })
            .ref('text')
            .addClass('im-blocknode__content')

        const loadingSpan = $$('span')
            .append('Loading...')
            .addClass('text-pdf')

        if (fileNode.uuid) {
            el.append([this.renderHeader($$, fileNode), textEditor])
        } else {
            el.append([this.renderHeader($$, fileNode), loadingSpan])
        }

        return el
    }

    renderHeader($$, fileNode) {
        return $$('div')
            .append([
                $$(FontAwesomeIcon, {icon: 'fa-file-pdf-o'}),
                $$('a').append(this.getLabel('Portable Document Format'))
                    .attr('contenteditable', false)
                    .attr('href', fileNode.getUrl())
                    .addClass('pdf-link')
                    .attr('target', '_blank')
                    .on('click', function (evt) {
                        evt.stopPropagation();
                    })
            ])
            .addClass('header')
            .attr('contenteditable', false)
    }
}

export default XimpdfComponent

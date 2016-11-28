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

    render($$) {
        const doc = api.doc
        const node = this.props.node

        const fileNode = doc.get(node.pdfFile)

        const el = $$('div').addClass('ximpdf__container')

        const headerEl = $$('a')
            .append($$('span').addClass('ximpdf-content')
                .append($$('a')
                    .append([
                        $$(FontAwesomeIcon, {icon: 'fa-file-pdf-o'})
                            .addClass('title-icon'),
                        $$('span')
                            .append('Portable Document Format')
                            .addClass('title-pdf')
                    ])
                    .attr('href', fileNode.url)
                    .attr('target', '_blank')
                    .on('click', function (evt) {
                        evt.stopPropagation();
                    })
                ))

        const textEditor = $$(TextPropertyEditor, {
            tagName: 'div',
            path: [this.props.node.id, 'text'],
            doc: this.props.doc
        })
            .ref('text')
            .addClass('text-pdf')

        const loadingSpan = $$('span')
            .append('Loading...')
            .addClass('text-pdf')

        if (node.text) {
            el.append([headerEl, textEditor])
        } else {
            el.append([headerEl, loadingSpan])
        }

        return el
    }
}

export default XimpdfComponent

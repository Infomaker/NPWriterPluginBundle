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

        if (node.text) {
            el.append([this.renderHeader($$, fileNode), textEditor])
        } else {
            el.append([this.renderHeader($$, fileNode), loadingSpan])
        }

        return el
    }

    renderContent($$) {
        const content = $$('div')
            .addClass('im-blocknode__content')

        const link = $$('a').append(this.props.node.label)
            .attr('href', "#" + this.props.node.uuid)
            .attr('target', '_blank')
            .on('click', function (evt) {
                evt.stopPropagation();
            })

        content.append(link)
        return content
    }

    renderHeader($$, fileNode) {
        return $$('div')
            .append([
                $$(FontAwesomeIcon, {icon: 'fa-file-pdf-o'}),
                $$('a').append(this.getLabel('Portable Document Format'))
                    .attr('contenteditable', false)
                    .attr('href', fileNode.url)
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

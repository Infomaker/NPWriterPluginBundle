import {Component, TextPropertyEditor} from 'substance'

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
        const node = this.props.node
        const el = $$('div').addClass('sc-ximpdf')

        el.append(
            $$(TextPropertyEditor, {
                tagName: 'div',
                path: [this.props.node.id, 'text'],
                doc: this.props.doc
            }).ref('text').addClass('se-text')
        )

        //el.append($$('div').append($$('img').attr('src', node.thumbnail_url).attr('style', 'width:100%')))
        //el.append($$('h2').append(node.getPdfFile().text).attr('style', 'background-color: #efefef; padding: 10px 15px; font-size:1rem'))

        return el
    }
}

export default XimpdfComponent

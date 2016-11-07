import { Component, TextPropertyEditor } from 'substance'
import ImageDisplay from '../se.infomaker.ximimage/ImageDisplay'

class XimteaserComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    _onDocumentChange(change) {
        if (change.isAffected(this.props.node.id) ||
            change.isAffected(this.props.node.imageFile)) {
            this.rerender()
        }
    }

    render($$) {
        let node = this.props.node
        let el = $$('div').addClass('sc-ximteaser')

        el.append('I AM A TEASER')

        el.append(
            $$(ImageDisplay, { node: node })
        )

        el.append(
            $$(TextPropertyEditor, {
                tagName: 'div',
                path: [this.props.node.id, 'title'],
                doc: this.props.doc
            }).ref('caption').addClass('se-title')
        );
        return el
    }
}

export default XimteaserComponent
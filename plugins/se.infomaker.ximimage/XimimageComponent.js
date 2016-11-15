import { Component, TextPropertyEditor } from 'substance'
import ImageDisplay from './ImageDisplay'

class XimimageComponent extends Component {

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
        let el = $$('div').addClass('sc-ximimage')

        el.append(
            $$(ImageDisplay, {
                node: node,
                isolatedNodeState: this.props.isolatedNodeState
            }).ref('image')
        )

        el.append(
            $$(TextPropertyEditor, {
                tagName: 'div',
                path: [this.props.node.id, 'caption'],
                doc: this.props.doc
            }).ref('caption').addClass('se-caption')
        )
        return el
    }
}

export default XimimageComponent

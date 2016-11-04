import { Component } from 'substance'
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

    _onFileSelected(e) {
        let file = e.currentTarget.files[0]
        let nodeId = this.props.node.id
        let oldFileId = this.props.node.imageFile
        this.context.editorSession.transaction((tx) => {
            // create a new file node and replace the old one
            var newFile = tx.create({
                type: 'npfile',
                fileType: 'image',
                data: file
            })
            tx.set([nodeId, 'imageFile'], newFile.id)
            tx.delete(oldFileId)
        })
    }

    render($$) {
        let node = this.props.node
        let el = $$('div').addClass('sc-ximimage')

        el.append(
            $$(ImageDisplay, {node: node})
        )

        el.append(
            $$('input')
                .attr('type', 'file')
                .ref('fileInput')
                // .attr('multiple', 'multiple')
                .on('change', this._onFileSelected)
        )
        return el
    }
}

export default XimimageComponent
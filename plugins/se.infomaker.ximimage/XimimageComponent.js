import { Component } from 'substance'


class XimimageComponent extends Component {

    didMount() {
        // Trigger upload dialog
        // this.refs.fileInput.click()
        this.context.editorSession.onRender('document', this.rerender, this, { path: [this.props.node.id] })
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    _onFileSelected(e) {
        let file = e.currentTarget.files[0]
        let nodeId = this.props.node.id
        let fileId = this.props.node.imageFile

        // We store the image file and remove the url, so on next
        // save the resource gets uploaded and a new url gets set
        this.context.editorSession.transaction((tx) => {
            // Replace blob
            var newFile = tx.create({
                type: 'file',
                data: file
            })
            tx.set([nodeId, 'imageFile'], newFile.id)
            tx.delete(fileId)
        })
    }

    render($$) {
        let node = this.props.node
        let el = $$('div').addClass('sc-ximimage')
        let imgSrc = node.getUrl()

        if (imgSrc) {
            el.append(
                $$('img', {
                    src: imgSrc
                })
            )
        }

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
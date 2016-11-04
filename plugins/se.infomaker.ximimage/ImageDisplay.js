import { Component } from 'substance'

/*
  Intended to be used in Ximimage and Ximteaser
*/
class ImageDisplay extends Component {
    render($$) {
        let node = this.props.node
        let el = $$('div').addClass('sc-image-display')
        let imgSrc = node.getUrl()
        let Button = this.getComponent('button')

        if (imgSrc) {
            el.append(
                $$('img', { src: imgSrc })
            )
        }

        /* Invisible file input element */
        el.append(
            $$('input')
                .attr('type', 'file')
                .ref('fileInput')
                .on('change', this._onFileSelected)
        )

        el.append(
            $$('div').addClass('se-actions').append(
                $$(Button, {
                    icon: 'upload'
                }).on('click', this._replaceImage),
                $$(Button, {
                    icon: 'image'
                }).on('click', this._openMetaData),
                $$(Button, {
                    icon: 'crop'
                }).on('click', this._openCropper)
            )
        )
        return el
    }

    _replaceImage() {
        this.refs.fileInput.click()
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

    _openMetaData() {
        this.context.editorSession.startWorkflow('edit-image-metadata', {node: this.props.node})
    }

    _openCropper() {
        this.context.editorSession.startWorkflow('crop-image', {node: this.props.node})
    }
}

export default ImageDisplay


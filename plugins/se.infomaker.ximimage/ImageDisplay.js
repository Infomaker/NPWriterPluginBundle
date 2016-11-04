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

        el.append(
            $$(Button, {
                icon: 'image'
            }).on('click', this._openMetaData),
            $$(Button, {
                icon: 'crop'
            }).on('click', this._openCropper)
        )
        return el
    }

    _openMetaData() {
        this.context.editorSession.startWorkflow('edit-image-metadata', {node: this.props.node})
    }

    _openCropper() {
        this.context.editorSession.startWorkflow('crop-image', {node: this.props.node})
    }
}

export default ImageDisplay


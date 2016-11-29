import { Component, Button, FontAwesomeIcon } from 'substance'
import ImageCropper from './ImageCropper'
import ImageMetadata from './ImageMetadata'

/*
  Intended to be used in Ximimage and Ximteaser and other content types
  that include an imageFile property.
*/
class ImageDisplay extends Component {
    didMount() {
        this.handleActions({
            closeModal: this._closeDialog
        })
    }

    render($$) {
        let imgContainer = $$('div').addClass('se-image-container'),
            imgSrc = this.props.node.getUrl()

        if (imgSrc) {
            imgContainer.append(
                $$('img', {
                    src: imgSrc
                }).ref('img')
            )
        } else {
            imgContainer.append(
                $$(FontAwesomeIcon, {
                    icon: 'fa-picture-o'
                })
                .attr('style', 'font-size:25rem;color:#efefef')
            )
        }

        imgContainer.append(
            $$('div').addClass('se-actions').append(
                $$(Button, {
                    icon: 'image'
                }).on('click', this._openMetaData),
                $$(Button, {
                    icon: 'crop'
                }).on('click', this._openCropper)
            )
        )

        let el = $$('div').addClass('sc-image-display')
        el.addClass('sm-' + this.props.isolatedNodeState)
        el.append(imgContainer)

        if (this.state.DialogClass) {
            el.append(
                $$(this.getComponent('modal'), {
                    width: 'medium',
                    textAlign: 'center'
                }).append(
                    $$(this.state.DialogClass, {
                        node: this.props.node
                    })
                )
            )
        }
        return el
    }

    _closeDialog() {
        this.setState({
            DialogClass: null
        })
    }

    _openMetaData() {
        this.setState({
            DialogClass: ImageMetadata
        })
    }

    _openCropper() {
        this.setState({
            DialogClass: ImageCropper,
            src: this.props.node.getUrl()
        })
    }
}

export default ImageDisplay

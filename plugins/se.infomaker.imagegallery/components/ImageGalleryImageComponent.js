import {Component} from 'substance'
import {api, idGenerator} from 'writer'

class ImageGalleryImageComponent extends Component {
    
    render($$) {
        const numberDisplay = $$('div').addClass('number-display')
        const itemWrapper = $$('div', {class: 'item-wrapper'})
        const imageWrapper = $$('div').addClass('image-wrapper')
        const imageNode = this.props.node.document.get(this.props.imageFile)
        const imageEl = $$('img', { src: imageNode.getUrl()})
        const removeIcon = $$('i').addClass('remove-image fa fa-times')
            .on('click', this.props.removeImage)
        
        imageWrapper.append(imageEl)
        numberDisplay.append(this.props.index + 1)

        itemWrapper.append(numberDisplay)
        itemWrapper.append(imageWrapper)
        itemWrapper.append(this.renderImageMeta($$, this.props.imageFile))
        itemWrapper.append(removeIcon)

        return itemWrapper
    }

    renderImageMeta($$, imageFile) {
        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        const galleryImageNode = this.props.node.document.get(`${imageFile}-galleryImage`)
        const imageMeta = $$('div').addClass('image-meta')
        const bylineInput = $$(FieldEditor, {
            id: idGenerator(),
            node: galleryImageNode,
            disabled: false,
            multiLine: false,
            field: 'byline',
            placeholder: 'Byline',
            icon: 'fa-user'
        }).ref('bylineInput')
        const captionInput = $$(FieldEditor, {
            id: idGenerator(),
            node: galleryImageNode,
            disabled: false,
            multiLine: false,
            field: 'caption',
            placeholder: 'Bildtext' + this.props.isolatedNodeState,
            icon: 'fa-align-left'
        }).ref('captionInput')

        imageMeta.append(bylineInput, captionInput)

        bylineInput.on('click', () => { 
            bylineInput.grabFocus()
        })
        
        captionInput.on('click', () => { 
            captionInput.grabFocus()
        })

        return imageMeta
    }
}

export default ImageGalleryImageComponent

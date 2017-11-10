import {Container} from 'substance'

class ImageGalleryNode extends Container {

}

ImageGalleryNode.define({
    type: 'imagegallery',
    dataType: { type: 'string' },
    genericCaption: {type: 'string', optional: true, default: ''}
})

export default ImageGalleryNode
export const INSERT_IMAGE_GALLERY_COMMAND = `${ImageGalleryNode.type}-insert-gallery`
export const INSERT_IMAGE_COMMAND = `${ImageGalleryNode.type}-insert-image`
export const IMAGE_GALLERY_ICON = 'fa fa-caret-square-o-right'
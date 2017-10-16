import {BlockNode} from 'substance'

class ImageGalleryNode extends BlockNode {

}

ImageGalleryNode.define({
    type: 'imagegallery',
    dataType: { type: 'string' },
    imageFiles: {type: 'array', optional: true},
    genericCaption: {type: 'string', optional: true, default: ''},
    caption: {type: 'string', default: ''},
    alttext: {type: 'string', optional: true},
    credit: {type: 'string', optional: true},
})

export default ImageGalleryNode
export const INSERT_IMAGE_GALLERY_COMMAND = `${ImageGalleryNode.type}-insert-gallery`
export const INSERT_IMAGE_COMMAND = `${ImageGalleryNode.type}-insert-image`
export const IMAGE_GALLERY_ICON = 'fa fa-map-o'
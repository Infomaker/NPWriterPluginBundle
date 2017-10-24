import {BlockNode} from 'substance'

class ImageGalleryImageNode extends BlockNode {

}

ImageGalleryImageNode.define({
    type: 'imagegalleryimage',
    imageFile: {type: 'file', optional: true},
    byline: {type: 'string', default: ''},
    caption: {type: 'string', default: ''},
})

export default ImageGalleryImageNode

import {BlockNode} from 'substance'

class ImageGalleryImageNode extends BlockNode {

}

ImageGalleryImageNode.define({
    type: 'imagegalleryimage',
    byline: {type: 'string', default: ''},
    caption: {type: 'string', default: ''},
})

export default ImageGalleryImageNode

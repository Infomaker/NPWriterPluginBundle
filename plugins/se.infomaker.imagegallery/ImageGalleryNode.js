import {BlockNode} from 'substance'
import ImageGalleryConverter from './ImageGalleryConverter';

class ImageGalleryNode extends BlockNode {

}

ImageGalleryNode.define({
    type: ImageGalleryConverter.type,
    dataType: { type: 'string' },
    caption: {type: 'string', default: ''},
    alttext: {type: 'string', optional: true},
    credit: {type: 'string', optional: true},
})

export default ImageGalleryNode
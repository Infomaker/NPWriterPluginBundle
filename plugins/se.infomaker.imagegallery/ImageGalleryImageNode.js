import {withTraits, traitBundle} from 'writer'
import {BlockNode} from 'substance'

const {imageNodeTrait, authorNodeTrait} = traitBundle

/**
 * @class ImageGalleryImageNode
 * @mixes imageNodeTrait
 * @mixes authorNodeTrait
 */
class ImageGalleryImageNode extends withTraits(BlockNode, imageNodeTrait, authorNodeTrait) {
}

ImageGalleryImageNode.define({
    type: 'imagegalleryimage',
    imageFile: {type: 'file', optional: true},
    authors: {type: 'array', default: []},
    caption: {type: 'string', default: ''},
    width: {type: 'number', optional: true},
    height: {type: 'number', optional: true}
})

export default ImageGalleryImageNode

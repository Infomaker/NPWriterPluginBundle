import {withTraits, traitBundle} from 'writer'
import {BlockNode} from 'substance'

const {imageNodeTrait, authorNodeTrait, imageCropTrait} = traitBundle

/**
 * @class ImageGalleryImageNode
 * @mixes imageNodeTrait
 * @mixes authorNodeTrait
 * @mixes imageCropTrait
 */
class ImageGalleryImageNode extends withTraits(BlockNode, imageNodeTrait, authorNodeTrait, imageCropTrait) {
}

ImageGalleryImageNode.define({
    type: 'imagegalleryimage',
    imageFile: {type: 'file', optional: true},
    authors: {type: 'array', default: []},
    caption: {type: 'string', default: ''},
    width: {type: 'number', optional: true},
    height: {type: 'number', optional: true},
    disableAutomaticCrop: {type: 'boolean', optional: true, default: false},
    crops: {type: 'object', default: []}
})

export default ImageGalleryImageNode

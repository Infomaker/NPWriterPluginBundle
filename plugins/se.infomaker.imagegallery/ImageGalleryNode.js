import {Container} from 'substance'
import {api, fetchImageMeta} from 'writer'

class ImageGalleryNode extends Container {

    constructor(...args) {
        super(...args)
        this.on('onImagesAdded', galleryImageNodes => this.onImagesAdded(galleryImageNodes))
    }

    /**
     * Event which triggers when one or more images are added to an ImageGallery
     *
     * @see ./InsertImageCommand.js
     * @param galleryImageNodes
     */
    onImagesAdded(galleryImageNodes) {
        galleryImageNodes.reduce((p, galleryImageNode) => {
            return p.then(() => {
                const imageNode = api.editorSession.getDocument().get(galleryImageNode.imageFile)
                return fetchImageMeta(imageNode.uuid)
                    .then((node) => {
                        api.editorSession.transaction((tx) => {
                            tx.set([galleryImageNode.id, 'width'], node.width)
                            tx.set([galleryImageNode.id, 'height'], node.height)
                            if (!galleryImageNode.caption && node.caption) {
                                tx.set([galleryImageNode.id, 'caption'], node.caption)
                            }
                            if (!galleryImageNode.authors.length && node.authors) {
                                tx.set([galleryImageNode.id, 'authors'], node.authors)
                            }
                            if (!imageNode.uri) {
                                tx.set([imageNode.id, 'uri'], node.uri)
                            }
                        })
                    })
            })
        }, Promise.resolve())
    }
}

ImageGalleryNode.define({
    type: 'imagegallery',
    dataType: {type: 'string'},
    genericCaption: {type: 'string', optional: true, default: ''},
    uuid: {type: 'string', optional: true}
})

export default ImageGalleryNode
export const INSERT_IMAGE_GALLERY_COMMAND = `${ImageGalleryNode.type}-insert-gallery`
export const INSERT_IMAGE_COMMAND = `${ImageGalleryNode.type}-insert-image`
export const IMAGE_GALLERY_ICON = 'fa fa-caret-square-o-right'

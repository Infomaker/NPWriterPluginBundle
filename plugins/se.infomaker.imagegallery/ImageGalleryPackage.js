import './scss/image-gallery.scss'
import './scss/image-gallery-toolbox.scss'

import ImageGalleryNode, {INSERT_IMAGE_GALLERY_COMMAND, INSERT_IMAGE_COMMAND} from './ImageGalleryNode'
import ImageGalleryImageNode from './ImageGalleryImageNode'
import ImageGalleryComponent from './components/ImageGalleryComponent'
import InsertImageGalleryTool from './InsertImageGalleryTool'
import InsertImageGalleryCommand from './InsertImageGalleryCommand'
import ImageGalleryConverter from './ImageGalleryConverter'
import InsertImageCommand from './InsertImageCommand'

const ImageGalleryPackage = {
    name: ImageGalleryNode.type,
    id: 'se.infomaker.imagegallery',
    configure(config) {
        
        config.addNode(ImageGalleryNode)
        config.addNode(ImageGalleryImageNode)
        config.addComponent(ImageGalleryNode.type, ImageGalleryComponent)

        config.addContentMenuTopTool(INSERT_IMAGE_GALLERY_COMMAND, InsertImageGalleryTool)
        config.addCommand(INSERT_IMAGE_GALLERY_COMMAND, InsertImageGalleryCommand)
        config.addCommand(INSERT_IMAGE_COMMAND, InsertImageCommand)

        config.addConverter('newsml', ImageGalleryConverter)

        config.addIcon('angle-left', { 'fontawesome': 'fa-angle-left' })
        config.addIcon('angle-right', { 'fontawesome': 'fa-angle-right' })
        config.addIcon('remove', { 'fontawesome': 'fa-times' })

        /* Labels */
        config.addLabel('Image gallery', {
            'sv': 'Bildspel'
        })
        config.addLabel('Insert Image gallery', {
            'sv': 'Infoga bildspel'
        })
        config.addLabel('Dropzone label', {
            'sv': 'Dra och släpp bild(er) här'
        })
        config.addLabel('Generic caption', {
            'sv': 'Gemensam bildtext'
        })
    }
}

export default ImageGalleryPackage
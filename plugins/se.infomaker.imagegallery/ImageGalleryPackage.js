import './scss/image-gallery.scss'

import ImageGalleryComponent from './ImageGalleryComponent'
import ImageGalleryNode, {INSERT_IMAGE_GALLERY_COMMAND, INSERT_IMAGE_COMMAND} from './ImageGalleryNode'
import InsertImageGalleryTool from './InsertImageGalleryTool'
import InsertImageGalleryCommand from './InsertImageGalleryCommand'
import ImageGalleryConverter from './ImageGalleryConverter';
import InsertImageCommand from './InsertImageCommand';


const ImageGalleryPackage = {
    name: ImageGalleryNode.type,
    id: 'se.infomaker.imagegallery',
    configure(config) {
        
        config.addNode(ImageGalleryNode)
        config.addComponent(ImageGalleryNode.type, ImageGalleryComponent)

        config.addContentMenuTopTool(INSERT_IMAGE_GALLERY_COMMAND, InsertImageGalleryTool)
        config.addCommand(INSERT_IMAGE_GALLERY_COMMAND, InsertImageGalleryCommand)
        config.addCommand(INSERT_IMAGE_COMMAND, InsertImageCommand)

        config.addConverter('newsml', ImageGalleryConverter)

        /* Labels */
        config.addLabel('Image gallery', {
            'sv': 'Bildspel'
        })
        config.addLabel('Insert Image gallery', {
            'sv': 'Infoga bildspel'
        })
        config.addLabel('Dropzone label', {
            'sv': 'Lägg till bild'
        })
        config.addLabel('Generic caption', {
            'sv': 'Generic caption'
        })
    }
}

export default ImageGalleryPackage
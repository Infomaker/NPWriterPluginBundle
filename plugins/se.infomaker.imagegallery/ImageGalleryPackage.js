import './scss/image-gallery.scss'

import ImageGalleryComponent from './ImageGalleryComponent'
import ImageGalleryNode from './ImageGalleryNode'
import InsertImageGalleryTool from './InsertImageGalleryTool'
import InsertImageGalleryCommand from './InsertImageGalleryCommand'
import ImageGalleryConverter from './ImageGalleryConverter';

const ImageGalleryPackage = {
    name: ImageGalleryNode.type,
    id: 'se.infomaker.imagegallery',
    configure(config) {
        
        config.addNode(ImageGalleryNode)
        config.addComponent(ImageGalleryNode.type, ImageGalleryComponent)

        config.addContentMenuTopTool(`${ImageGalleryNode.type}tool`, InsertImageGalleryTool)
        config.addCommand(`${ImageGalleryNode.type}tool`, InsertImageGalleryCommand)

        config.addConverter('newsml', ImageGalleryConverter)

        config.addLabel('Insert Image gallery', {
            'sv': 'Infoga bildspel'
        })
    }
}

export default ImageGalleryPackage
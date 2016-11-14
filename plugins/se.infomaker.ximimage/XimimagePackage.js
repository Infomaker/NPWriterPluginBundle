import XimimageComponent from './XimimageComponent'
import XimimageConverter from './XimimageConverter'
import Ximimage from './Ximimage'
import InsertImagesTool from './InsertImagesTool'
import InsertImagesCommand from './InsertImagesCommand'
import DropImageFile from './DropImageFile'
import DropImageUri from './DropImageUri'

export default {
    name: 'ximimage',
    id: 'se.infomaker.ximimage',
    configure: function (config) {
        config.addNode(Ximimage)
        config.addComponent(Ximimage.type, XimimageComponent)
        config.addConverter('newsml', XimimageConverter)
        config.addContentMenuTool('insert-images', InsertImagesTool)
        config.addCommand('insert-images', InsertImagesCommand)

        config.addConverter('newsml', XimimageConverter)
        config.addDragAndDrop(DropImageFile)
        config.addDragAndDrop(DropImageUri)

        config.addIcon('image', { 'fontawesome': 'fa-image' })
        config.addIcon('crop', { 'fontawesome': 'fa-crop' })
        config.addIcon('upload', { 'fontawesome': 'fa-upload' })
    }
}
import XimimageComponent from './XimimageComponent'
import XimimageConverter from './XimimageConverter'
import Ximimage from './Ximimage'
import XimimageFileNode from './XimimageFileNode'
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
        config.addContentMenuTopTool('insert-images', InsertImagesTool)
        config.addCommand('insert-images', InsertImagesCommand)

        config.addNode(XimimageFileNode)

        config.addConverter('newsml', XimimageConverter)
        config.addDragAndDrop(DropImageFile)
        config.addDragAndDrop(DropImageUri)

        config.addIcon('image', { 'fontawesome': 'fa-image' })
        config.addIcon('crop', { 'fontawesome': 'fa-crop' })
        config.addIcon('upload', { 'fontawesome': 'fa-upload' })
    }
}

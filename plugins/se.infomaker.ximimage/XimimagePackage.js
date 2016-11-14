import XimimageComponent from './XimimageComponent'
import XimimageConverter from './XimimageConverter'
import Ximimage from './Ximimage'
import XimimageTool from './XimimageTool'
import XimimageCommand from './XimimageCommand'
import DropXimimage from './DropXimimage'

export default {
    name: 'ximimage',
    id: 'se.infomaker.ximimage',
    configure: function (config) {
        config.addNode(Ximimage)
        config.addComponent(Ximimage.type, XimimageComponent)
        config.addConverter('newsml', XimimageConverter)
        config.addContentMenuTool('ximimagetool', XimimageTool)
        config.addCommand('ximimagetool', XimimageCommand)

        config.addConverter('newsml', XimimageConverter)
        config.addDragAndDrop(DropXimimage)

        config.addIcon('image', { 'fontawesome': 'fa-image' })
        config.addIcon('crop', { 'fontawesome': 'fa-crop' })
        config.addIcon('upload', { 'fontawesome': 'fa-upload' })
    }
}
import XimimageComponent from './XimimageComponent'
import XimimageConverter from './XimimageConverter'
import Ximimage from './Ximimage'
import InsertImagesTool from './InsertImagesTool'
import InsertImagesCommand from './InsertImagesCommand'
import DropImageFile from './DropImageFile'
import DropImageUri from './DropImageUri'
import XimimageFileProxy from './XimimageFileProxy'

export default {
    name: 'ximimage',
    id: 'se.infomaker.ximimage',
    configure: function (config) {
        config.addNode(Ximimage)
        config.addComponent(Ximimage.type, XimimageComponent)
        config.addConverter('newsml', XimimageConverter)
        config.addContentMenuTopTool('insert-images', InsertImagesTool)
        config.addCommand('insert-images', InsertImagesCommand)

        config.addConverter('newsml', XimimageConverter)
        config.addDragAndDrop(DropImageFile)
        config.addDragAndDrop(DropImageUri)

        config.addIcon('image', { 'fontawesome': 'fa-image' })
        config.addIcon('crop', { 'fontawesome': 'fa-crop' })
        config.addIcon('upload', { 'fontawesome': 'fa-upload' })

        config.addFileProxy(XimimageFileProxy)

        // TODO: Add scripts for crop dialog
        // config.addExternalScript()

        config.addLabel('Upload image', {
            en: 'Upload image',
            sv: 'Ladda upp bild'
        })
    }
}

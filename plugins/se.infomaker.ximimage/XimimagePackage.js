import XimimageComponent from "./XimimageComponent";
import XimimageConverter from "./XimimageConverter";
import Ximimage from "./Ximimage";
import InsertImagesTool from "./InsertImagesTool";
import InsertImagesCommand from "./InsertImagesCommand";
import DropImageFile from "./DropImageFile";
import DropImageUri from "./DropImageUri";
import DropImageUUID from "./DropImageUUID";
import XimimageFileProxy from "./XimimageFileProxy";
import InsertImageUrlCommand from "./InsertImageUrlCommand";
import ImageDisplay from "./ImageDisplay";
import XimimageModule from "./XimimageModule"
import isImage from './isImage'
import InsertImageMacro from './InsertImageMacro'

export default {
    name: 'ximimage',
    id: 'se.infomaker.ximimage',
    configure: function (config) {
        config.addNode(Ximimage)
        config.addComponent(Ximimage.type, XimimageComponent)
        config.addConverter('newsml', XimimageConverter)
        config.addContentMenuTopTool('insert-images', InsertImagesTool)
        config.addCommand('insert-images', InsertImagesCommand)
        config.addCommand('ximimage-insert-image-url', InsertImageUrlCommand)
        config.addMacro(InsertImageMacro)
        config.addComponent('imageDisplay', ImageDisplay)
        config.addConverter('newsml', XimimageConverter)
        config.addDragAndDrop(DropImageFile)
        config.addDragAndDrop(DropImageUri)
        config.addDragAndDrop(DropImageUUID)

        config.addPluginModule(
            'se.infomaker.ximimage',
            'ximimagehandler',
            XimimageModule
        )
        config.addPluginModule(
            'se.infomaker.ximimage',
            'isImage',
            isImage
        )

        config.addIcon('image', {'fontawesome': 'fa-image'})
        config.addIcon('crop', {'fontawesome': 'fa-crop'})
        config.addIcon('user-plus', {'fontawesome': 'fa-user-plus'})
        config.addIcon('upload', {'fontawesome': 'fa-upload'})
        config.addIcon('remove', {'fontawesome': 'fa-times'})

        config.addFileProxy(XimimageFileProxy)

        // TODO: Add scripts for crop dialog
        // config.addExternalScript()

        config.addLabel('Upload image', {
            en: 'Upload image',
            sv: 'Ladda upp bild'
        })

        config.addLabel('remove-image-button-title', {
            en: 'Remove image',
            sv: 'Ta bort bild'
        })

        config.addLabel('Image archive information', {
            sv: 'Arkivinformation om bild'
        })

        config.addLabel('Add to image byline', {
            sv: 'Lägg till byline till bild'
        })

        config.addLabel('Add to byline', {
            sv: 'Lägg till byline'
        })
        // config.addLabel('', {
        //     sv: ''
        // })
    }
}

import Ximimage from "./Ximimage";
import XimimageConverter from "./XimimageConverter";

import XimimageComponent from "./components/Ximimage";
import ImageDisplayComponent from "./components/ImageDisplay";

import DropImageFile from "./drop/File";
import DropImageUri from "./drop/Uri";
import DropImageUUID from "./drop/Uuid";

import XimimageFileProxy from "./XimimageFileProxy";

import InsertImagesTool from "./InsertImagesTool";
import InsertImagesCommand from "./InsertImagesCommand";
import InsertImageUrlCommand from "./InsertImageUrlCommand";
import InsertImageMacro from './InsertImageMacro'

import Softcrops from "./models/Softcrops"
import isImage from './models/isImage'

export default {
    name: 'ximimage',
    id: 'se.infomaker.ximimage',
    version: '{{version}}',
    configure: function (config) {
        config.addNode(Ximimage)
        config.addComponent(Ximimage.type, XimimageComponent)
        config.addConverter('newsml', XimimageConverter)
        config.addContentMenuTopTool('insert-images', InsertImagesTool)
        config.addCommand('insert-images', InsertImagesCommand)
        config.addCommand('ximimage-insert-image-url', InsertImageUrlCommand)
        config.addMacro(InsertImageMacro)
        config.addComponent('imageDisplay', ImageDisplayComponent)
        config.addConverter('newsml', XimimageConverter)

        // Drop handlers
        config.addDropHandler(new DropImageUUID())
        config.addDropHandler(new DropImageFile())
        config.addDropHandler(new DropImageUri())

        config.addPluginModule(
            'se.infomaker.ximimage.ximimagehandler',
            Softcrops
        )

        config.addPluginModule(
            'se.infomaker.ximimage.isImage',
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

        config.addLabel('Remove', {
            sv: 'Ta bort'
        })

        config.addLabel('Disable automatic crop in frontend', {
            sv: 'Använd inte automatisk crop vid utvisning'
        })
    }
}

import Ximimage from "./Ximimage";
import XimimageConverter from "./XimimageConverter";

import XimimageComponent from "./components/Ximimage";
import ImageDisplayComponent from "./components/ImageDisplay";

import DropImageFile from "./drop/File";
import DropImageUri from "./drop/Uri";
import DropImageUUID from "./drop/Uuid";

import { URIObjectDropHandler } from "./drop/URIObjectDropHandler"
import { URIObjectDropExecutor } from "./drop/URIOBjectDropExecutor"

import XimimageSettings from "./XimimageSettings";
import XimimageFileProxy from "./XimimageFileProxy";

import InsertImagesTool from "./InsertImagesTool";
import InsertImagesCommand from "./InsertImagesCommand";
import InsertImageUrlCommand from "./InsertImageUrlCommand";
import InsertImageMacro from './InsertImageMacro'

export default {
    name: 'ximimage',
    id: 'se.infomaker.ximimage',
    version: '{{version}}',
    configure: function (config) {
        config.addNode(Ximimage)
        config.addComponent(Ximimage.type, XimimageComponent)
        config.addConverter(XimimageConverter)
        config.addContentMenuTopTool('insert-images', InsertImagesTool)
        config.addCommand('insert-images', InsertImagesCommand)
        config.addCommand('ximimage-insert-image-url', InsertImageUrlCommand)
        config.addMacro(InsertImageMacro)
        config.addComponent('imageDisplay', ImageDisplayComponent)

        // Drop handlers
        config.addDropHandler(
            new URIObjectDropHandler('x-im/image', URIObjectDropExecutor)
        )
        config.addDropHandler(new DropImageUUID())
        config.addDropHandler(new DropImageFile())
        config.addDropHandler(new DropImageUri())

        // Settings
        config.addPluginModule(
            'se.infomaker.ximimage.settings',
            XimimageSettings,
            'se.infomaker.npwriter.settings'
        )

        config.addIcon('image', {'fontawesome': 'fa-image'})
        config.addIcon('crop', {'fontawesome': 'fa-crop'})
        config.addIcon('download', {'fontawesome': 'fa-download'})
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
            sv: 'Lägg till byline'
        })

        config.addLabel('Add to byline', {
            sv: 'Lägg till byline'
        })

        config.addLabel('Remove', {
            sv: 'Ta bort'
        })

        config.addLabel('The image doesn\'t seem to be available just yet. Please wait a few seconds and try again.', {
            sv: 'Bilden verkar inte finnas tillgänglig än. Vänta ett par sekunder och försök igen.'
        })

        config.addLabel('image-error-title', {
            en: 'Error during image upload',
            sv: 'Fel vid bilduppladdning'
        })

        config.addLabel('unsupported-image-error-message', {
            en: 'The image could not be uploaded as it is an unsupported format.',
            sv: 'Bilden kunde inte laddas upp då den är av ett format som inte stöds.'
        })

        config.addLabel('image-upload-error-message', {
            en: 'The image could not be uploaded. Please make sure it is a supported format and size does not exceed the maximum upload size.',
            sv: 'Bilden kunde inte laddas upp. Var god och kontrollera att att bildformatet stöds och filstorleken inte överskrider maxstorleken.'
        })

        config.addLabel('image-display-modes', {
            en: 'Image display mode',
            sv: 'Visningsformat för bilder'
        })

        config.addLabel('image-display-mode-normal', {
            en: 'Normal',
            sv: 'Normal'
        })

        config.addLabel('image-display-mode-slim', {
            en: 'Slim',
            sv: 'Avskalad'
        })

        config.addLabel('image-display-mode-minimized', {
            en: 'Minimized',
            sv: 'Minimerad'
        })

        config.addLabel('download-image-button-title', {
            en: 'Download image',
            sv: 'Ladda ned bild'
        })
    }
}

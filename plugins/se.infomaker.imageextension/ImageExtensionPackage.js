import ImageExtensionComponent from "./ImageExtensionComponent"

export default {
    id: 'se.infomaker.imageextension',
    name: 'imageextension',
    version: '{{version}}',
    configure: function(config) {

        config.addPluginModule(
            'se.infomaker.imageextension',
            ImageExtensionComponent,
            'se.infomaker.npwriter.dialogimage'
        )
    }
}

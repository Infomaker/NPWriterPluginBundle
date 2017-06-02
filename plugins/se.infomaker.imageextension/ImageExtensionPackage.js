import ImageExtensionComponent from "./ImageExtensionComponent"

export default {
    id: 'se.infomaker.imageextension',
    name: 'imageextension',
    version: '{{version}}',
    configure: function(config) {

        config.addLabel('Gender bias in image', {
            sv: 'Genusbias i bilden'
        })

        config.addLabel('Describe the main objects in the image', {
            sv: 'Beskriv huvudobjekten i bilden'
        })

        config.addLabel('Premium image for sale', {
            sv: 'Premium bild som kan säljas'
        })

        config.addPluginModule(
            'se.infomaker.imageextension',
            ImageExtensionComponent,
            'se.infomaker.npwriter.dialogimage'
        )
    }
}

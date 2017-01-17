import ImageIntegrationComponent from './ImageIntegrationComponent'
import './scss/imageintegration.scss'

export default {
    id: 'se.infomaker.newspilot.imageintegration',
    name: 'npimageintegration',

    configure: function (config) {
        config.addSidebarTab('npimageintegration', 'Jobb bilder')

        config.addComponentToSidebarWithTabId('npimageintegration', 'npimageintegration', ImageIntegrationComponent)
    }
}

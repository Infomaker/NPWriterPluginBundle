import './scss/index.scss'
import DevKitComponent from './DevKitComponent'

export default {
    name: 'DW Plugin',
    id: 'se.infomaker.writerdashboardplugin',
    configure: config => {
        config.addComponentToSidebarWithTabId('DW Plugin', 'main', DevKitComponent)
    },

    title: 'DW Plugin',
    description: `DW - Dashboard Writer communication`,
    version: '{{version}}',
    organization: 'Infomaker Scandinavia AB',
    website: 'https://github.com/Infomaker/NPWriterDevKit',
    tags: [],
    authors: [
        {
            name: "Hamzah Al Hariri",
            email: "hamzah.alhariri@infomaker.se"
        }
    ]
}
import './scss/index.scss'
import DashboardIntegrationComponent from './DashboardIntegrationComponent'

export default {
    name: 'dashboardintegration',
    id: 'se.infomaker.dashboardintegration',
    configure: (config, pluginConfig) => {
        config.addToSidebar('main', pluginConfig, DashboardIntegrationComponent)
    },

    title: 'DW Plugin',
    description: `DW - Dashboard Writer communication`,
    version: '{{version}}',
    organization: 'Infomaker Scandinavia AB',
    website: 'https://github.com/Infomaker/NPWriterDevKit',
    tags: [],
    authors: [
        {
            name: 'Hamzah Al Hariri',
            email: 'hamzah.alhariri@infomaker.se'
        }
    ]
}

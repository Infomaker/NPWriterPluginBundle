const { registerPlugin } = writer
import MainComponent from './MainComponent'

const archivesearchPackage = {
    id: 'se.infomaker.archivesearch',
    name: 'im-archivesearch',
    version: '{{version}}',
    configure: (config, pluginConfig) => {

        let tabIdentifier = 'im-archivesearch'
        if (pluginConfig && pluginConfig.tabIdentifier) {
            tabIdentifier = pluginConfig.tabIdentifier
        }
        else {
            config.addSidebarTab('im-archivesearch', 'Archive image search')
        }

        config.addComponentToSidebarWithTabId(
            'im-archivesearch-component',
            tabIdentifier,
            MainComponent)

        config.addLabel('Archive image search', {
            sv: 'Bildsök'
        })

    }
}

export default () => {
    if (registerPlugin) {
        registerPlugin(archivesearchPackage)
    }
    else {
        console.info('Register method not yet availlable for imagesearch package')
    }
}

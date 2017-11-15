const { registerPlugin } = writer

import './scss/archivesearch.scss'
import MainComponent from './components/MainComponent'
import ArchiveSearchDropHandler from './ArchiveSearchDropHandler'

const archivesearchPackage = {
    id: 'se.infomaker.archivesearch',
    name: 'im-archivesearch',
    version: '{{version}}',
    configure: (config, pluginConfig) => {


        // TODO: Remove this, maybe use later
        // let tabIdentifier = 'im-archivesearch'
        // if (pluginConfig && pluginConfig.tabIdentifier) {
        //     tabIdentifier = pluginConfig.tabIdentifier
        // } else {
        //     config.addSidebarTab('im-archivesearch', 'Archive image search')
        // }

        config.addLabel('Archive Image Search', {
            sv: 'Bildsök'
        })

        config.addSidebarTab('im-archivesearch', config.getLabelProvider().getLabel('Archive Image Search'))
        config.addComponentToSidebarWithTabId('im-archivesearch-component', 'im-archivesearch', MainComponent)
        config.addDropHandler(new ArchiveSearchDropHandler())

        config.addLabel('Search...', {
            sv: 'Sök...'
        })
        config.addLabel('Show', {
            sv: 'Visa'
        })
        config.addLabel('Sort', {
            sv: 'Sortera'
        })
        config.addLabel('Showing', {
            sv: 'Visar'
        })
        config.addLabel('of', {
            sv: 'av'
        })
        config.addLabel('Missing image description', {
            sv: 'Saknar bildbeskrivning'
        })
    }
}

export default () => {
    if (registerPlugin) {
        registerPlugin(archivesearchPackage)
    }
    else {
        console.info('Register method not yet available for im-archivesearch package')
    }
}

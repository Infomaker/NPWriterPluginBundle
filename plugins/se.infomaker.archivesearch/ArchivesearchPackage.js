const {registerPlugin} = writer

import './scss/archivesearch.scss'
import MainComponent from './components/MainComponent'
import ArchiveSearchDropHandler from './ArchiveSearchDropHandler'

const archivesearchPackage = {
    id: 'se.infomaker.archivesearch',
    name: 'im-archivesearch',
    version: '{{version}}',
    configure: (config, pluginConfig) => {
        config.addLabel('Archive Image Search', {
            sv: 'Bildsök'
        })

        config.addToSidebar('Archive Image Search', pluginConfig, MainComponent)
        config.addDropHandler(new ArchiveSearchDropHandler())

        config.addLabel('Search...', {
            sv: 'Sök...'
        })
        config.addLabel('Relevance', {
            sv: 'Relevans'
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
        config.addLabel('Show Image', {
            sv: 'Visa Bild'
        })
        config.addLabel('Close', {
            sv: 'Stäng'
        })
        config.addLabel('Source', {
            sv: 'Källa'
        })
        config.addLabel('Photo Date', {
            sv: 'Fotodatum'
        })
        config.addLabel('Credit', {
            sv: 'Tillskrivning'
        })
        config.addLabel('Name', {
            sv: 'Objektnamn'
        })
        config.addLabel('Missing image', {
            sv: 'Bild saknas'
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

import './scss/articlelanguage.scss'
import MainComponent from './components/MainComponent'

export default {
    id: 'se.infomaker.articlelanguage',
    name: 'im-articlelanguage',
    version: '{{version}}',
    configure: (configurator, pluginConfig) => {
        configurator.addLabel('Article Language', {
            sv: 'Artikelspråk'
        })

        configurator.addToSidebar('main', pluginConfig, MainComponent)
    }
}

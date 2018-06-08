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


        configurator.addPopover(
            'im-articlelanguage',
            {
                title: 'Language',
                align: 'left',
                sticky: false
            },
            MainComponent
        )
    }
}

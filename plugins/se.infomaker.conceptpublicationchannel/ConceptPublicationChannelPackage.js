import ConceptPublicationMainComponent from './components/ConceptPublicationMainComponent'
import './scss/main.scss'

const XimConceptPackage = {

    id: 'se.infomaker.conceptpublicationchannel',
    name: 'conceptpublicationchannel',
    version: '{{version}}',
    configure(configurator, pluginConfig) {

        configurator.addToSidebar('main', pluginConfig, ConceptPublicationMainComponent)

        configurator.addLabel('publication-channel-title', {
            sv: 'Publiceringskanaler'
        })

    }
}

export default XimConceptPackage
import ConceptMainComponent from './components/ConceptMainComponent'
import './scss/xmimconcept.scss'
import './scss/ximconcept-dialog.scss'

const XimConceptPackage = {
    
    id: 'se.infomaker.ximconcept',
    name: 'ximconcept',
    version: '{{version}}',
    configure(configurator, config) {
        configurator.addComponentToSidebarWithTabId(
            config.id,
            config.tabid || 'main',
            ConceptMainComponent,
            config
        )

        configurator.addLabel('create', {
            sv: 'Skapa'
        })
        configurator.addLabel('save', {
            sv: 'Spara'
        })
        configurator.addLabel('cancel', {
            sv: 'Avbryt'
        })
    }
}

export default XimConceptPackage

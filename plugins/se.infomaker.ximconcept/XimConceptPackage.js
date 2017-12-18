import ConceptMainComponent from './components/ConceptMainComponent'
import './scss/xmimconcept.scss'
import './scss/ximconcept-icon.scss'
import './scss/ximconcept-dialog.scss'
import './scss/ximconcept-image.scss'

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
        configurator.addLabel('Replaced by', {
            sv: 'Ersatt av'
        })
        configurator.addLabel('No polygon edit', {
            sv: 'Redigering av polygoner är för närvarande inte möjlig'
        })
        configurator.addLabel('Place or location search', {
            sv: 'Sök adress eller plats'
        })
        configurator.addLabel('invalid.conceptItem.label', {
            sv: 'Conceptet du försöker använda verkar vara ogiltigt'
        })
        configurator.addLabel('invalid.uuid.label', {
            sv: 'Ogiltigt UUID'
        })
        configurator.addLabel('invalid.uuid.description', {
            sv: 'Conceptet har inget giltigt UUID'
        })
    }
}

export default XimConceptPackage

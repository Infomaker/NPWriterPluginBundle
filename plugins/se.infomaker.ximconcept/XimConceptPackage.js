import ConceptMainComponent from './components/ConceptMainComponent'
import './scss/xmimconcept.scss'
import './scss/ximconcept-icon.scss'
import './scss/ximconcept-dialog.scss'
import './scss/ximconcept-image.scss'

const XimConceptPackage = {

    id: 'se.infomaker.ximconcept',
    name: 'ximconcept',
    version: '{{version}}',
    configure(configurator, pluginConfig) {

        configurator.addToSidebar('main', pluginConfig, ConceptMainComponent)

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
        configurator.addLabel('invalid.concept.label', {
            sv: 'Ogiltigt Koncept'
        })
        configurator.addLabel('invalid.concept.description', {
            sv: 'Konceptet kunde inte hämtas'
        })
        configurator.addLabel('conceptitem.exists.label', {
            sv: 'Konceptet är redan kopplat'
        })
        configurator.addLabel('conceptitem.exists.description', {
            sv: 'Konceptet du försöker använda finns redan med i listan'
        })
        configurator.addLabel('invalid.uuid.label', {
            sv: 'Ogiltigt UUID'
        })
        configurator.addLabel('duplicate.uuid.label', {
            sv: 'Dubblett'
        })
        configurator.addLabel('invalid.uuid.description', {
            sv: 'Conceptet har inget giltigt UUID'
        })

        configurator.addLabel('no.concept.plugin.configured.for.type.label', {
            sv: 'Okänd koncepttyp'
        })

        configurator.addLabel('no.concept.plugin.configured.for.type.description', {
            sv: 'Det finns inget plugin konfigurerat som hanterar den här koncepttypen'
        })
    }
}

export default XimConceptPackage

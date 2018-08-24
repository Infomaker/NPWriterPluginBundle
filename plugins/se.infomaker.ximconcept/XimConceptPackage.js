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

        configurator.addLabel('Create', {
            sv: 'Skapa'
        })
        configurator.addLabel('Save', {
            sv: 'Spara'
        })
        configurator.addLabel('Cancel', {
            sv: 'Avbryt'
        })
        configurator.addLabel('Replaced by', {
            sv: 'Ersatt av',
        })
        configurator.addLabel('No polygon edit', {
            sv: 'Redigering av polygoner är för närvarande inte möjlig via writern',
            en: 'Currently there is no support for polygon editing from the writer'
        })
        configurator.addLabel('Place or location search', {
            sv: 'Sök adress eller plats'
        })
        configurator.addLabel('Invalid Concept item', {
            sv: 'Conceptet du försöker använda verkar vara ogiltigt'
        })
        configurator.addLabel('Unable to fetch the concept item', {
            sv: 'Konceptet kunde inte hämtas'
        })
        configurator.addLabel('Concept item exists', {
            sv: 'Konceptet är redan kopplat'
        })
        configurator.addLabel('This Concept is already used', {
            sv: 'Konceptet du försöker lägga till används redan'
        })
        configurator.addLabel('Invalid UUID', {
            sv: 'Ogiltigt UUID'
        })
        configurator.addLabel('Duplicate', {
            sv: 'Dubblett'
        })
        configurator.addLabel('Invalid Concept-UUID', {
            sv: 'Conceptet har inget giltigt UUID'
        })
        configurator.addLabel('unable to parse geometric data', {
            sv: 'den geometriska datan kan inte tolkas'
        })
        configurator.addLabel('Unknown Concept-type', {
            sv: 'Okänd koncepttyp'
        })

        configurator.addLabel('No Concept-plugin configured for this type', {
            sv: 'Det finns inget plugin konfigurerat för att hanterar den här koncepttypen'
        })
    }
}

export default XimConceptPackage

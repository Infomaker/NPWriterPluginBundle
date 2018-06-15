import {ExternalUpdateComponent} from './ExternalUpdateComponent'

export default {
    id: 'se.infomaker.externalupdate',
    name: 'externalupdate',
    version: '{{version}}',
    configure: function (config, pluginConfig) {

        config.addToSidebar('main', pluginConfig, ExternalUpdateComponent)

        config.addLabel('externalChangeTitle', {
            sv: 'Artikeln har uppdaterats',
            en: 'The article has been updated'
        })

        config.addLabel('externalChangeSomeone', {
            sv: 'En extern tjänst',
            en: 'An external service'
        })

        config.addLabel('externalChangeMessage', {
            sv: 'Artikeln har uppdaterats externt och alla ändringar har automatiskt påförts artikeln. ' +
            'Inga åtgärder krävs och det här är endast ett informationsmeddelande',
            en: 'The article has changed externally and all changes has been automatically applied. ' +
            'No further actions are required by you, this is only an information message'
        })

        config.addLabel('messageFailed', {
            sv: 'Dokumentet har ändrats externt. Ändringarna kunde inte ' +
            'påföras artikeln på ett korrekt sätt. ' +
            'Du behöver kopiera och klistra in dina ändringar manuellt ' +
            'efter det att artikeln laddats om. ',
            en: 'The document has been updated by an external part. ' +
            'The changes could not be applied correctly. ' +
            'You need to manually copy&paste your changes and reload the article.'
        })

        config.addLabel('messageFailedReason', {
            sv: 'Anledning',
            en: 'Reason'
        })
    }
}

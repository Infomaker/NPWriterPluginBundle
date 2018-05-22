import {ExternalUpdateComponent} from './ExternalUpdateComponent'

export default {
    id: 'se.infomaker.externalupdate',
    name: 'externalupdate',
    version: '{{version}}',
    configure: function (config) {

        config.addPopover(
            'externalupdatecomponent',
            {
                icon: 'fa-server',
                align: 'right',
                sticky: true
            },
            ExternalUpdateComponent
        )

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
    }
}

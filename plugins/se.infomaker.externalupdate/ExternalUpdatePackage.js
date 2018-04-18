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
    }
}

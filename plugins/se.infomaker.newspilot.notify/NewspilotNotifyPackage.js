import NotifyComponent from './NotifyComponent'
import {hook} from 'writer'

export default {
    name: 'Newspilot Notifier',
    id: 'se.infomaker.newspilot.notify',
    configure: function (config) {

        config.addHook(hook.AFTER_SAVE, NotifyComponent);
/*
        config.addPopover(
            'newspilot_notifier',
            {
                icon: 'fa-location-arrow connected',
                align: 'right',
                sticky: false
            },
            NotifyComponent
        );
*/
        //config.addComponentToSidebarWithTabId(this.id, 'main', NotifyComponent);

        config.addLabel('failed_to_update', {
            en: 'Could not update Newspilot article',
            sv: 'Kunde inte uppdatera artikeln i Newspilot.'
        });

        config.addLabel('failed_to_create', {
            en: 'Could not create Newspilot article',
            sv: 'Kunde inte skapa artikeln i Newspilot.'
        });

        config.addLabel('title', {
            en: 'Newspilot Notify Component',
            sv: 'Newspilot Notifieringsplugin'
        });
        config.addLabel('sent_to_newspilot', {
            en: 'Last sent to Newspilot',
            sv: 'Skickad till Newspilot'
        });
        config.addLabel('error', {
            en: 'Error',
            sv: 'Fel'
        });
    }
}
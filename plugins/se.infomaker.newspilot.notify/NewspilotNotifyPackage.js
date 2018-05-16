import NotifyComponent from './NotifyComponent'
import NewspilotLoginComponent from './NewspilotLoginComponent'
import {hook} from 'writer'

export default {
    name: 'Newspilot Notifier',
    id: 'se.infomaker.newspilot.notify',
    configure: function (config) {

        config.addHook(hook.BEFORE_SAVE, NewspilotLoginComponent);
        config.addHook(hook.AFTER_SAVE, NotifyComponent);

        config.addLabel('failed_to_update', {
            en: 'Could not update Newspilot article',
            sv: 'Kunde inte uppdatera artikeln i Newspilot.'
        });

        config.addLabel('failed_to_create', {
            en: 'Could not create Newspilot article',
            sv: 'Kunde inte skapa artikeln i Newspilot.'
        });
    }
}

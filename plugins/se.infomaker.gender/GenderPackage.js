import './scss/gender.scss';

import GenderComponent from './GenderComponent'

export default {
    id: 'se.infomaker.gender',
    name: 'gender',
    version: '{{version}}',
    configure: function (config) {

        config.addLabel('gender-label', {
            en: 'Gender',
            sv: 'Genus'
        });

        config.addComponentToSidebarWithTabId(this.id, 'main', GenderComponent)
    }
}

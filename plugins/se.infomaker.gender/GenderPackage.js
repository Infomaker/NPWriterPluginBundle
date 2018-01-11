import './scss/gender.scss';

import GenderComponent from './GenderComponent'

export default {
    id: 'se.infomaker.gender',
    name: 'gender',
    version: '{{version}}',
    configure: function (config, pluginConfig) {

        config.addLabel('gender-label', {
            en: 'Gender',
            sv: 'Genus'
        });

        config.addToSidebar('main', pluginConfig, GenderComponent)
    }
}

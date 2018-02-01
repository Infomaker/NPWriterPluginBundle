import './admeta.scss'

import AdmetaComponent from './AdmetaComponent'

export default {
    name: 'admeta',
    id: 'se.infomaker.slm.admeta',
    configure: function (config, pluginConfig) {
        config.addToSidebar('main', pluginConfig, AdmetaComponent)

        config.addLabel('admeta-keywords', {
            en: 'Ad keywords',
            sv: 'Reklamnyckelord'
        })
        config.addLabel('admeta-add-keywords', {
            en: 'Add keywords',
            sv: 'Lägg till nyckelord'
        })
        config.addLabel('admeta-campaign-id', {
            en: 'Campaign ID',
            sv: 'Kampanj-id'
        })
        config.addLabel('admeta-set-campaign-id', {
            en: 'Set campaign ID',
            sv: 'Sätt kampanj-id'
        })
        config.addLabel('admeta-add-item', {
            en: 'Add: ',
            sv: 'Lägg till: '
        })
    }
}

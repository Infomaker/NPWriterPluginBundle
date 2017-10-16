import AdinfoComponent from './AdinfoComponent'

export default {
    name: 'adinfo',
    id: 'se.stampen.adinfo',
    configure: function (config) {
        config.addComponentToSidebarWithTabId(this.id, 'main', AdinfoComponent)

        config.addLabel('adinfo-keywords', {
            en: 'Ad keywords',
            sv: 'Reklamnyckelord'
        })
        config.addLabel('adinfo-add-keywords', {
            en: 'Add keywords',
            sv: 'Lägg till nyckelord'
        })
        config.addLabel('adinfo-campaign-id', {
            en: 'Campaign ID',
            sv: 'Kampanj-id'
        })
        config.addLabel('adinfo-set-campaign-id', {
            en: 'Set campaign ID',
            sv: 'Sätt kampanj-id'
        })
    }
}

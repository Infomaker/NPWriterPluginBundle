import PublishFlowComponent from './PublishFlowComponent'

export default {
    name: 'publishflow',
    id: 'se.infomaker.publishflow',

    configure: function (config) {
        config.addPopover(
            this.id + '_1',
            {
                icon: 'fa-ellipsis-h',
                button: true,
                align: 'right'
            },
            PublishFlowComponent
        )

        config.addLabel('Save', {
            sv: 'Spara'
        })

        config.addLabel('Save *', {
            sv: 'Spara *'
        })

        config.addLabel('imext:draft', {
            en: 'Draft',
            sv: 'Utkast'
        })

        config.addLabel('imext:done', {
            en: 'Ready for approval',
            sv: 'Redo för godkännande'
        })

        config.addLabel('stat:withheld', {
            en: 'Scheduled for publication',
            sv: 'Schemalagd för publicering'
        })

        config.addLabel('stat:usable', {
            en: 'Published',
            sv: 'Publicerad'
        })

        config.addLabel('stat:canceled', {
            en: 'Unpublished',
            sv: 'Avpublicerad'
        })
    }
}

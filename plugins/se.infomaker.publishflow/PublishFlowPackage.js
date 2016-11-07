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

        config.addLabel('Cancel', {
            sv: 'Avbryt'
        })

        config.addLabel('Publish article?', {
            sv: 'Publicera artikeln?'
        })

        config.addLabel('This article is currently an unpublished draft', {
            sv: 'Den här artikeln är ett ej publicerat utkast'
        })

        config.addLabel('Article is currently pending approval', {
            sv: 'Artikeln väntar på godkännande'
        })

        config.addLabel('Scheduled', {
            sv: 'Schemalagd'
        })

        config.addLabel('Article is scheduled to be published', {
            sv: 'Artiklen är schemalagd för publicering'
        })

        config.addLabel('From', {
            sv: 'Från'
        })

        config.addLabel('To', {
            sv: 'Till'
        })

        config.addLabel('Republish article?', {
            sv: 'Ompublicera artikeln?'
        })

        config.addLabel('Article was published', {
            sv: 'Artikeln publicerades'
        })

        config.addLabel('Publish article again?', {
            sv: 'Publicera artikeln igen?'
        })

        config.addLabel('Article has been canceled and is no longer published', {
            sv: 'Artikeln har blivit avpublicerad och är ej längre publicerad'
        })

        config.addLabel('Unknown state', {
            sv: 'Okänd status'
        })

        config.addLabel('This article has an unknown, unsupported, status', {
            sv: 'Artikeln har en okänd eller felaktig status'
        })

        config.addLabel('Save as draft', {
            sv: 'Spara som utkast'
        })

        config.addLabel('Ready for approval', {
            sv: 'Redo för godkännande'
        })

        config.addLabel('Schedule for publish', {
            sv: 'Schemalägg publicering'
        })

        config.addLabel('Republish article', {
            sv: 'Ompublicera artikeln'
        })

        config.addLabel('Publish article', {
            sv: 'Publicera artikeln'
        })

        config.addLabel('Unpublish article', {
            sv: 'Avpublicera artikeln'
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

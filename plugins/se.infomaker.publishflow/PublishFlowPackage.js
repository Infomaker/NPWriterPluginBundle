import PublishFlowComponent from './PublishFlowComponent'

export default {
    name: 'publishflow',
    id: 'se.infomaker.publishflow',
    index: 100,
    version: '{{version}}',
    configure: function (config) {
        config.addPopover(
            this.id + '_1',
            {
                icon: 'fa-ellipsis-h',
                button: 'Save',
                align: 'right'
            },
            PublishFlowComponent
        )

        config.addLabel('Save', {
            sv: 'Spara'
        })

        config.addLabel('Update', {
            sv: 'Uppdatera'
        })

        config.addLabel('Save *', {
            sv: 'Spara *'
        })

        config.addLabel('Update *', {
            sv: 'Uppdatera *'
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
            sv: 'Klar för godkännande'
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
            sv: 'Klar för godkännande'
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

        config.addLabel('Create a new article', {
            sv: 'Skapa en ny artikel'
        })

        config.addLabel('Create a new copy of this article', {
            sv: 'Skapa en kopia på den här artikeln'
        })

        config.addLabel('Article contains unsaved changes. Continue without saving?', {
            sv: 'Artikeln innehåller osparade ändringar. Fortsätt utan att spara?'
        })

        config.addLabel('Oops, the save operation timed out', {
            sv: 'Hoppsan, det tog för lång tid att spara artikeln'
        })

        config.addLabel('Please try again', {
            sv: 'Vänligen prova igen'
        })
    }
}

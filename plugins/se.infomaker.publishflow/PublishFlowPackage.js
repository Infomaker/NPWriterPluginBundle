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
                icon: 'fa-caret-down',
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

        config.addLabel('Publish from', {
            sv: 'Publiceras från'
        })

        config.addLabel('Publish to', {
            sv: 'Publiceras till'
        })

        config.addLabel('Unknown state', {
            sv: 'Okänd status'
        })

        config.addLabel('This article has an unknown, unsupported, status', {
            sv: 'Artikeln har en okänd eller felaktig status'
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

        config.addLabel('Whoops, the save operation timed out', {
            sv: 'Hoppsan, det tog för lång tid att spara artikeln'
        })

        config.addLabel('Please try again', {
            sv: 'Vänligen prova igen'
        })

        config.addLabel('A valid publication start time required for this status', {
            sv: 'För att sätta denna status krävs en korrekt tid för publiceringsstart'
        })

        config.addLabel('A valid publication stop time required for this status', {
            sv: 'För att sätta denna status krävs en korrekt tid för publiceringstopp'
        })
    }
}

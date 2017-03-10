import './scss/history.scss'

import HistoryMainComponent from './HistoryMainComponent'

export default({
    id: 'se.infomaker.history',
    name: 'history',
    configure: function(config) {
        // config.addComponentToSidebarWithTabId('historyagentcomponent', 'main', HistoryAgentComponent)

        config.addLabel('Unsaved articles found', {
            sv: 'Osparade artiklar har hittats'
        })

        config.addLabel('It looks like there are one or more unsaved articles. Do you want to restore an unsaved article?', {
            sv: 'Det ser ut som om det finns en eller flera påbörjade artiklar som inte sparats. Vill du återställa en osparad artikel?'
        })

        config.addLabel('No thanks, create new article', {
            sv: 'Nej tack, skapa en ny artikel'
        })

        config.addLabel('Unsaved changes found for this article', {
            sv: 'Osparade ändringar hittades för den här artikeln'
        })

        config.addLabel('We found some unsaved changes for this article. Do you want to restore the unsaved changes?', {
            sv: 'Vi hittade osparade ändringar för den här artikeln. Vill du återskapa de senaste osparade ändringarna?'
        })

        config.addLabel('Restore unsaved changes', {
            sv: 'Återskapa osparade ändringar'
        })

        config.addLabel('Restore latest unsaved article', {
            sv: 'Återskapa senast osparade artikeln'
        })

        config.addLabel('No thanks, just open the article', {
            sv: 'Nej tack, öppna artikeln'
        })

        config.addLabel('Show advanced list of changes', {
            sv: 'Visa detaljerad ändringshistorik'
        })

        config.addLabel('Hide advanced list of changes', {
            sv: 'Dölj detaljerad ändringshistorik'
        })

        config.addLabel('history-popover-headline', {
            en: 'Unsaved articles',
            sv: 'Osparade artiklar'
        })

        config.addLabel('history-popover-description', {
            en: 'Change history for this article.',
            sv: 'Här listas dina osparade artiklar.'
        })

        config.addLabel('history-popover-existing-article', {
            en: 'Existing article.',
            sv: 'Befintlig artikel.'
        })
        config.addLabel('history-popover-non-existing-article', {
            en: 'New unsaved article',
            sv: 'Ny osparad artikel'
        })
        config.addLabel('history-popover-no-items-description', {
            en: 'No unsaved articles',
            sv: 'Du har inga osparade artiklar'
        })

        config.addLabel('history-remove-all-button', {
            en: 'Remove all',
            sv: 'Rensa alla'
        })

        config.addLabel('history-remove-all-confirm', {
            en: 'Yes I am sure',
            sv: 'Ja, jag vill rensa alla'
        })

        config.addLabel('Identical with the current version', {
            sv: 'Identisk med den aktuella versionen'
        })

        config.addLabel('Clear this version history', {
            sv: 'Radera denna versionshistorik'
        })

        config.addPopover(
            'historymaincomponent',
            {
                icon: 'fa-history',
                align: 'right',
                sticky: true
            },
            HistoryMainComponent
        )


    }
})

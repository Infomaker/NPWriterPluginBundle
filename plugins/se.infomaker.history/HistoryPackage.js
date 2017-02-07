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

        config.addLabel('We\'ve found some unsaved articles. Below is a list if you would like to restore one of them.', {
            sv: 'Vi har hittat några osparade artiklar. Nedan är en lista med osparade artiklar, klicka på en av dem ifall du vill återställa någon.'
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
            en: 'Changes since last successful save',
            sv: 'Senaste ändringar'
        })

        config.addLabel('history-popover-description', {
            en: 'Changes since last successful save',
            sv: 'Ändringar sedan senast lyckade uppdatering till servern.'
        })

        config.addPopover(
            'historymaincomponent',
            {
                icon: 'fa-history',
                align: 'right'
            },
            HistoryMainComponent
        )


    }
})

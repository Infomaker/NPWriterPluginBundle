import './scss/history.scss'

import HistoryMainComponent from './HistoryMainComponent'

export default({
    id: 'se.infomaker.history',
    name: 'history',
    configure: function(config) {
        // config.addComponentToSidebarWithTabId('historyagentcomponent', 'main', HistoryAgentComponent)

        config.addLabel('history-popover-headline', {
            nl: 'Recente wijzigingen',
            en: 'Changes since last successful save',
            sv: 'Senaste ändringar'
        })

        config.addLabel('history-popover-description', {
            nl: 'Wijzigingen sinds de laatste succesvolle bewaring',
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


import './style.scss'

import UATrackerComponent from './UATrackerComponent'

export default {
    name: 'uatracker',
    id: 'se.infomaker.uatracker',
    configure: function(config) {

        config.addPopover(
            'uatracker',
            {
                icon: 'fa-user',
                align: 'left'
            },
            UATrackerComponent
        )

        config.addLabel('connected-users-headline', {
            en: 'Users with this article open',
            sv: 'Användare som har denna artikel öppen'
        })
        config.addLabel('connected-users-description', {
            en: 'Following users has this article open, which means that you might not be able to save you article',
            sv: 'Följande användare har denna artikel öppen för redigering. Detta kan innebära att de ändringar du gör inte kan sparas.'
        })

        config.addLabel('connected-users-qty-connected', {
            en: ' users connected',
            sv: ' anslutna användare'
        })

        config.addLabel('(You)', {
            en: '(You)',
            sv: '(Du)'
        })
    }
}
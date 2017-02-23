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

        // Login Component

        config.addLabel('We would like you to enter email and name', {
            en: 'We would like you to enter email and name. This information is shared with other people that opens the same articles as you',
            sv: 'Vi skulle vilja be dig att fylla i din epostadress och namn. Informationen kommer delas med de som har artiklar öppna samtidigt med dig.'
        })

        config.addLabel('Enter your email address', {
            sv: 'Ange din epost-adress'
        })

        config.addLabel('Enter your name', {
            sv: 'Ange ditt namn'
        })

        // UATracker component
        config.addLabel('connected-users-headline', {
            en: 'Users with this article open',
            sv: 'Användare som har denna artikel öppen'
        })
        config.addLabel('connected-users-description', {
            en: 'Following users has this article open, which means that you might not be able to save you article',
            sv: 'Följande användare har denna artikel öppen för redigering. Detta kan innebära att de ändringar du gör inte kan sparas.'
        })

        config.addLabel('no-connection-headline', {
            en: 'No connection to user identification service',
            sv: 'Ingen anslutning till identifieringstjänsten'
        })

        config.addLabel('no-connection-description', {
            en: 'Unable to connect to user identification service. This means that it might be others users working on this article.',
            sv: 'Det gick inte ansluta till identifieringstjänsten. Detta innebär att andra användare kan ha denna artikeln öppen samtidigt.'
        })

        config.addLabel('connected-users-qty-connected', {
            en: ' users connected',
            sv: ' anslutna användare'
        })

        config.addLabel('uatracker-no-connetion', {
            en: 'No connection',
            sv: 'Ingen anslutning'
        })

        config.addLabel('(You)', {
            en: '(You)',
            sv: '(Du)'
        })
        config.addLabel('Logout', {
            en: 'Logout',
            sv: 'Logga ut'
        })
    }
}
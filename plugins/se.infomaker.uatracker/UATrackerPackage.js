import UATrackerComponent from './components/UATracker'

export default {
    name: 'uatracker',
    id: 'se.infomaker.uatracker',
    version: '{{version}}',
    configure: function(config) {

        config.addTopBarComponent('uatracker', { align: 'right' }, UATrackerComponent)

        // Misc
        config.addLabel('confirm-understand', {
            en: 'I understand',
            sv: 'Jag förstår'
        })

        config.addLabel('unlock', {
            en: 'Unlock',
            sv: 'Lås upp'
        })

        // Unlock dialog
        config.addLabel('uatracker-unlock-article-title', {
            en: 'Temporarily Locked',
            sv: 'Tillfälligt låst'
        })

        config.addLabel('uatracker-unlock-article-message', {
            en: 'Unlocking and taking over an article will overwrite the active users unsaved changes. If you are unsure, check with the active user before unlocking.',
            sv: 'Att låsa upp och ta över en artikel kommer skriva över den aktiva användarens ändringar som inte är sparade. Om du är osäker, kontrollera med den aktiva användaren innan.'
        })

        // Article locked dialog
        config.addLabel('uatracker-article-locked-title', {
            en: 'CHANGE ME',
            sv: 'Artikeln är låst och inga ändringar du gör kommer att sparas'
        })

        config.addLabel('uatracker-article-locked-message', {
            en: 'CHANGE ME',
            sv: 'För att göra ändringar i artikeln måste du låsa upp den först.'
        })

        // Article takover dialog
        config.addLabel('uatracker-article-taken-over-title', {
            en: 'CHANGE ME',
            sv: 'Någon har låst och tagit över artikeln'
        })

        config.addLabel('uatracker-article-taken-over-message', {
            en: 'CHANGE ME',
            sv: '{{name}} ({{email}}) har låst och tagit över artikeln.'
        })

        // Article outdated dialog
        config.addLabel('uatracker-article-outdated-title', {
            en: 'CHANGE ME',
            sv: 'Det finns en nyare version av artikeln'
        })

        config.addLabel('uatracker-article-outdated-message', {
            en: 'CHANGE ME',
            sv: 'Artikeln har blivit sparad av en annan användare. Ladda om sidan för att se de nya ändringarna.'
        })

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
        config.addLabel('Continue', {
            en: 'Continue',
            sv: 'Fortsätt'
        })
        config.addLabel('Logout', {
            en: 'Logout',
            sv: 'Logga ut'
        })
        config.addLabel('User logged in', {
            en: 'User logged in ',
            sv: 'Användaren loggade in '
        })
        config.addLabel('uatracker-dialog-title', {
            en: 'Identification',
            sv: 'Identifiering'
        })
    }
}

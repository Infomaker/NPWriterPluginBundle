import UATrackerComponent from './components/UATracker'

export default {
    name: 'uatracker',
    id: 'se.infomaker.uatracker',
    version: '{{version}}',
    configure: function(config) {

        config.addTopBarComponent('uatracker', { align: 'right' }, UATrackerComponent)

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
            en: 'The article is locked',
            sv: 'Artikeln är låst'
        })

        config.addLabel('uatracker-article-locked-message', {
            en: 'You must unlock the article before editing it.',
            sv: 'För att göra ändringar i artikeln måste du låsa upp den först.'
        })

        // Article takover dialog
        config.addLabel('uatracker-article-taken-over-title', {
            en: 'Someone has locked the article',
            sv: 'Någon har låst artikeln'
        })

        config.addLabel('uatracker-article-taken-over-message', {
            en: '{{name}} ({{email}}) has locked and taken control of the article',
            sv: '{{name}} ({{email}}) har låst och tagit över artikeln.'
        })

        // Article outdated dialog
        config.addLabel('uatracker-article-outdated-title', {
            en: 'There is a newer version of the article available',
            sv: 'Det finns en nyare version av artikeln'
        })

        config.addLabel('uatracker-article-outdated-message', {
            en: '{{name}} ({{email}}) has saved the article. Refresh the page to fetch the latest changes.',
            sv: '{{name}} ({{email}}) har sparat artikeln. Ladda om sidan för att se de nya ändringarna.'
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

        // No connection component
        config.addLabel('no-connection-headline', {
            en: 'No connection to user identification service',
            sv: 'Ingen anslutning till identifieringstjänsten'
        })

        config.addLabel('no-connection-description', {
            en: 'Unable to connect to user identification service. This means that there might be other users working on this article.',
            sv: 'Det gick inte ansluta till identifieringstjänsten. Detta innebär att andra användare kan ha denna artikeln öppen samtidigt.'
        })

        config.addLabel('uatracker-no-connetion', {
            en: 'No connection',
            sv: 'Ingen anslutning'
        })

        // Misc
        config.addLabel('confirm-understand', {
            en: 'I understand',
            sv: 'Jag förstår'
        })

        config.addLabel('reload-article', {
            en: 'Reload article',
            sv: 'Ladda om artikeln'
        })

        config.addLabel('unlock', {
            en: 'Unlock',
            sv: 'Lås upp'
        })

        config.addLabel('(You)', {
            en: '(You)',
            sv: '(Du)'
        })

        config.addLabel('Continue', {
            en: 'Continue',
            sv: 'Fortsätt'
        })

        config.addLabel('uatracker-dialog-title', {
            en: 'Identification',
            sv: 'Identifiering'
        })

        config.addLabel('uatracker-been-in', {
            en: 'Has been in for {{loginTime}}',
            sv: 'Har varit inne i {{loginTime}}'
        })
    }
}

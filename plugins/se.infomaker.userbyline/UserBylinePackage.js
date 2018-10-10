import { UserBylineComponent } from './components/UserBylineComponent'

import './scss/index.scss'
import './scss/author-suggestion.scss'

export default {
    name: 'im-user-byline',
    id: 'se.infomaker.user-byline',
    version: '{{version}}',
    configure(configurator) {
        configurator.addTopBarComponent('user', { align: 'right' }, UserBylineComponent)

        configurator.addLabel('Add author to byline', {
            sv: 'Lägg till författare'
        })

        configurator.addLabel('No author concepts matching logged in user was found.', {
            sv: 'Vi hittade inte någon författare som matchade inloggad användare.'
        })

        configurator.addLabel('There are several authors with the same email as you. Please select the one that is you.', {
            sv: 'Det finns flera författare med samma email som du. För att säkerställa att rätt författare kopplas till dig, ber vi dig berätta vem du är.'
        })

        configurator.addLabel('Is this you?', {
            sv: 'Är detta du?'
        })

        configurator.addLabel('Select', {
            sv: 'Använd'
        })

        configurator.addLabel('Refresh list', {
            sv: 'Uppdatera listan'
        })

        configurator.addLabel('Are you one of these authors?', {
            sv: 'Är du någon av dessa författare?'
        })

        configurator.addLabel('For assistance please contact your support department.', {
            sv: 'För hjälp vänligen kontakta din supportavdelning.'
        })

        configurator.addLabel('Already associated with another user', {
            sv: 'Redan kopplad mot en annan användare',
        })

        configurator.addLabel('Selected author will be associated with current user account. You only have to do this once.', {
            sv: 'Vald författare kommer att kopplas till din inloggade användare. Detta val behöver du därför enbart göra en gång.'
        })
    }
}

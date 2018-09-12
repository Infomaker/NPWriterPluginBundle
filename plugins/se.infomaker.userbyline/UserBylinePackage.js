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

        configurator.addLabel('No author concepts matching logged in user was found. Please contact your support department.', {
            sv: 'Vi hittade inga författare som matchade inloggad användare. Vänligen kontaka din administrativa avdelning.'
        })

        configurator.addLabel('Is this you?', {
            sv: 'Är detta du?'
        })

        configurator.addLabel('Are you one of these authors?', {
            sv: 'Är du någon av dessa författare?'
        })

        configurator.addLabel('If you cant find an author please contact your support department.', {
            sv: 'Hittar du inte dig själv så vänligen kontakta din administrativa avdelning.'
        })

        configurator.addLabel('Already associated with another user', {
            sv: 'Redan kopplad mot en annan användare',
        })

        configurator.addLabel('Selected author will be associated with current user account. You only have to do this once.', {
            sv: 'Vald författare kommer att kopplas till din inloggade användare. Detta val behöver du därför enbart göra en gång.'
        })
    }
}

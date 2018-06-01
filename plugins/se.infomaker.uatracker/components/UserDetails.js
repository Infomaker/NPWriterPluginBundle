import { Component, FontAwesomeIcon } from 'substance'
import { moment} from 'writer'

/**
 * Renders details about a single user to be displayed in the popover
 *
 * @class UserDetails
 * @extends {Component}
 * @property {Object} props
 * @property {User} props.user - User object to display
 * @example
    $$(UserDetails, {
        user: {
            isActiveUser: false,
            name: 'Example User',
            email: 'example.user@infomaker.se,
            timestamp: '1509361376933',
            socketId: '50w2YflUWbV2-sM6AABW',
            uuid: 'd92cb6aa-d444-4f99-ae22-61ba2691b09f',
            customerKey: 'im-writer'
        }
    })
 */
class UserDetails extends Component {

    render($$) {
        const user = this.props.user
        const loginTime = moment(Number(user.timestamp)).fromNow(true)
        let name = user.name

        if (user.isActiveUser) {
            name += ' ' + this.getLabel('(You)')
        }

        return $$('div', { class: 'popover-content user-details' }, [
            $$('div', { class: 'content' }, [
                $$('h2', { class: 'name heading' }, name),
                $$('div', { class: 'email message' }, user.email)
            ]),
            $$('div', { class: 'footer' }, [
                $$(FontAwesomeIcon, {icon: 'fa-clock-o'}),
                $$('div', { class: 'login-time' },
                    this.getLabel('uatracker-been-in')
                        .replace('{{loginTime}}', loginTime)
                )
            ])
        ])
    }
}

export default UserDetails

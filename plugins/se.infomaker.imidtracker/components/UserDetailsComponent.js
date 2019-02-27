import {Component, FontAwesomeIcon} from 'substance'
import {moment} from 'writer'

/**
 * Renders details about a single user to be displayed in the popover
 *
 * @class UserDetailsComponent
 * @extends {Component}
 * @property {Object} props
 * @property {User} props.user - User object to display
 * @property {function} [props.logout] - Callback to run when logout button pressed
 * @example
 $$(UserDetailsComponent, {
        user: {
            isActiveUser: false,
            name: 'Example User',
            email: 'example.user@infomaker.se,
            timestamp: '1509361376933',
            socketId: '50w2YflUWbV2-sM6AABW',
            uuid: 'd92cb6aa-d444-4f99-ae22-61ba2691b09f',
            customerKey: 'im-writer'
        },
        logout: () => console.log('Logging out')
    })
 */
class UserDetailsComponent extends Component {

    render($$) {
        const user = this.props.user
        const loginTime = moment(Number(user.timestamp)).fromNow(true)
        let name = user.name
        let logoutButton = null

        if (user.isActiveUser && typeof this.props.logout === 'function') {
            name += ' ' + this.getLabel('(You)')
            logoutButton = $$('button', {class: 'btn btn-secondary logout'},
                this.getLabel('Logout')
            ).on('click', this.props.logout)
        }

        return $$('div', {class: 'popover-content user-details'}, [
            $$('div', {class: 'content'}, [
                $$('h2', {class: 'name heading'}, name),
                $$('div', {class: 'email message'}, user.email),
                logoutButton
            ]),
            $$('div', {class: 'footer'}, [
                $$(FontAwesomeIcon, {icon: 'fa-clock-o'}),
                $$('div', {class: 'login-time'},
                    this.getLabel('imidtracker-been-in')
                        .replace('{{loginTime}}', loginTime)
                )
            ])
        ])
    }
}

export {UserDetailsComponent}

import { Component, FontAwesomeIcon } from 'substance'
import { moment} from 'writer'

class UserDetails extends Component {

    render($$) {
        const user = this.props.user
        const loginTime = moment(Number(user.timestamp)).fromNow(true)
        let name = user.name
        let logoutButton = null

        if (user.isActiveUser) {
            name += ' ' + this.getLabel('(You)')
            logoutButton = $$('button', { class: 'btn btn-secondary logout'},
                this.getLabel('Logout')
            ).on('click', this.props.logout)
        }

        return $$('div', { class: 'popover-content user-details' }, [
            $$('div', { class: 'content' }, [
                $$('h2', { class: 'name heading' }, name),
                $$('div', { class: 'email message' }, user.email),
                logoutButton
            ]),
            $$('div', { class: 'footer' }, [
                $$(FontAwesomeIcon, {icon: 'fa-clock-o'}),
                $$('div', { class: 'login-time' },
                    this.getLabel('Har varit inne i ') + loginTime
                )
            ])
        ])
    }
}

export default UserDetails

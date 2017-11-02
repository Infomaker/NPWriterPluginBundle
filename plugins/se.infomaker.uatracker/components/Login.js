import {Component} from 'substance'
import {api} from 'writer'

class Login extends Component {

    didMount() {
        this.refs.email.getNativeElement().focus()
        this.send('dialog:disablePrimaryBtn')
    }

    render($$) {
        const el = $$('div').addClass('col-12 uatracker-login')
        const avatar = api.ui.getComponent('avatar')

        const description = $$('p').append(this.getLabel('We would like you to enter email and name'))

        const emailGroup = $$('div').addClass('form-group')
        const emailLabel = $$('span').append(this.getLabel('Enter your email address'))

        const emailInput = $$('input')
            .attr('type', 'text')
            .addClass('form-control')
            .ref('email')
            .on('keyup', this.validateEmail)
            .on('blur', this.loadAvatar)

        emailGroup.append([emailLabel, emailInput, $$(avatar, {avatarSource: 'gravatar', avatarId: null}).ref('avatar')])

        const nameGroup = $$('div').addClass('form-group')
        const label = $$('span').append('Enter your name')
        const name = $$('input').attr('type', 'text').addClass('form-control').ref('username')
        nameGroup.append([label, name])


        el.append([
            description,
            emailGroup,
            nameGroup
        ])

        return el
    }

    loadAvatar() {
        this.validateEmail()
        if (this.isValidEmail()) {
            const email = this.refs.email.val()
            this.refs.avatar.extendProps({
                avatarId: email
            })
        }
    }

    isValidEmail() {
        const email = this.refs.email.val()
        const regex = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)
        if (regex.test(email)) {
            return true
        } else {
            return false
        }
    }
    shouldRerender() {
        return false
    }
    validateEmail() {
        if (this.isValidEmail()) {
            this.send('dialog:enablePrimaryBtn')
        } else {
            this.send('dialog:disablePrimaryBtn')
        }
    }

    onClose(action) {
        if ('save' === action) {
            const email = this.refs.email.val()
            this.props.login({email: email, name: this.refs.username.val()})
            return true
        }
    }
}
export default Login

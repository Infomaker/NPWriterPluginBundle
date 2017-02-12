import {Component} from 'substance'
import {api} from 'writer'

class LoginComponent extends Component {

    didMount() {
        this.refs.email.focus()
        this.el.el.addEventListener('onkeydown', (e) => {
            console.log("E", e);
        })

        this.send('dialog:disablePrimaryBtn')
    }

    render($$) {
        const el = $$('div').addClass('col-12')

        const description = $$('p').append('Vi skulle vilja be dig att fylla i din epostadress och namn')

        const emailGroup = $$('div').addClass('form-group')
        const emailLabel = $$('span').append('Ange din epost-adress')

        const emailInput = $$('input')
            .attr('type', 'text')
            .addClass('form-control')
            .ref('email')
            .on('keydown', this.validateEmail)
            .on('blur', this.loadAvatar)

        emailGroup.append([emailLabel, emailInput])

        const nameGroup = $$('div').addClass('form-group')
        const label = $$('span').append('Ange dit namn')
        const name = $$('input').attr('type', 'text').addClass('form-control').ref('username')
        nameGroup.append([label, name])

        const avatar = api.ui.getComponent('avatar')
        el.append([
            description,
            $$(avatar, {avatarSource: 'gravatar', avatarId: null}).ref('avatar'),
            emailGroup,
            nameGroup
        ])

        return el
    }

    loadAvatar() {
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
export default LoginComponent
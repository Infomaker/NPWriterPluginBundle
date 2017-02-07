import {Component} from 'substance'

class LoginComponent extends Component {

    didMount() {
        this.refs.username.focus()
        this.el.el.addEventListener('onkeydown', (e) => {
            console.log("E", e);
        })

    }

    render($$) {
        const el = $$('div').addClass('form-group col-12')
        const label = $$('span').append('Ange ett användarnamn')
        const name = $$('input').attr('type', 'text').addClass('form-control').ref('username')

        const loginButton = $$('button').attr('type', 'button')
            .addClass('btn sc-np-btn btn-secondary btn-tertiary')
            .on('click', this.login)
            .append('Fortsätt')


        el.append([
            label,
            name,
            loginButton
        ])

        return el
    }

    login() {
        const username = this.refs.username.val()
        this.props.login(username)
        this.send('close')
    }
    onClose(action) {
        if('save' === action) {
            this.props.login(this.refs.username.val())
        }
    }
}
export default LoginComponent
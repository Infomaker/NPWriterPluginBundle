import {Component, Button, FontAwesomeIcon} from "substance";
import Auth from "./Auth";

export default class LoginComponent extends Component {

    render($$) {
        const el = $$('div').addClass('login-form');

        const form =
            $$('form')
                .addClass('form-control')
                .on('submit', this.doLogin)

        form.append($$('input').attr('type', 'text').attr('id', 'user').attr('placeholder', this.getLabel('user')).ref('user'))
        form.append($$('p'))
        form.append($$('input').attr('type', 'password').attr('id', 'password').attr('placeholder', this.getLabel('password')).ref('password'))

        form.append($$(Button, {icon: 'login'}).addClass('fa-2x').on('click', this.doLogin))

        el.append(form)

        if (this.state.error) {
            el.append($$('div').append($$(FontAwesomeIcon, 'warning')).append(this.getLabel(this.state.error)))
        }

        return el;
    }

    doLogin(e) {
        e.preventDefault();
        let user = this.refs.user.val()
        let password = this.refs.password.val()

        console.log("Logging in")

        Auth.login(user, password, this.props.server)
            .then(() => {
                this.extendState({error: undefined})
                this.send('login:success')
            })
            .catch((e) => {
                let message = e.message
                if (e.status && e.status === 401) {
                    message = 'Invalid username or password'
                }
                this.extendState({
                    error: message
                })
            })

        return false
    }

}
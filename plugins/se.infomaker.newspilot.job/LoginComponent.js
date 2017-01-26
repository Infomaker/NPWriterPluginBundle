import {Component} from "substance";
import Auth from "./Auth"

export default class LoginComponent extends Component {

    render($$) {
        const el = $$('div');

        const form =
            $$('form')
            .addClass('form-control')
            .on('submit', this.doLogin)

        form.append($$('label').attr('for', 'login').append(this.getLabel('login')))
        form.append($$('input').type('text').attr('id', 'login').ref('login'))

        form.append($$('label').attr('for', 'password').append(this.getLabel('password')))
        form.append($$('input').type('password').attr('id', 'password').ref('password'))

        if (this.state.error) {
            el.append('div').append("Hello error: " + this.state.error)
        }

        el.append(form)
        return el;
    }

    doLogin() {
        let login = this.refs.login.val()
        let password = this.refs.password.val()

        Auth.login(login, password)
            .then(() => {
                this.extendState({error: undefined})
                this.send('login:success')
            })
            .catch((e) => {
                this.extendState({
                    error: e.message
                })
            })
    }

}
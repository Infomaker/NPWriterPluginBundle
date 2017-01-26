import {Component} from "substance";
import Auth from "./Auth";

export default class LoginComponent extends Component {

    render($$) {
        const el = $$('div');

        const form =
            $$('form')
                .addClass('form-control')
                .on('submit', this.doLogin)

        form.append($$('label').attr('for', 'user').append(this.getLabel('user')))
        form.append($$('input').attr('type', 'text').attr('id', 'user').ref('user'))

        form.append($$('label').attr('for', 'password').append(this.getLabel('password')))
        form.append($$('input').attr('type', 'password').attr('id', 'password').ref('password'))

        form.append($$('input').attr('type', 'submit').append(this.getLabel('login')))

        if (this.state.error) {
            el.append('div').append("Hello error: " + this.state.error)
        }

        el.append(form)
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
                this.extendState({
                    error: e.message
                })
            })

        return false
    }

}
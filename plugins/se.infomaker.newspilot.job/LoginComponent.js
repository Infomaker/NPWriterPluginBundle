import {Component, FontAwesomeIcon} from "substance";
import Auth from "./Auth";

export default class LoginComponent extends Component {

    render($$) {
        const el = $$('div').addClass('login-form');


        const form =
            $$('form').on('submit', this.doLogin)

        form.append($$('h2').append(this.getLabel('Please login')))

        form.append(
            [
                $$('div').addClass('form-group').append(
                    $$('input').addClass('form-control')
                        .attr({type: 'text', id: 'user', placeholder: this.getLabel('user')})
                        .ref('user')),
                $$('div').addClass('form-group').append(
                    $$('input').addClass('form-control')
                        .attr({type: 'password', id: 'password', placeholder: this.getLabel('password')})
                        .ref('password')
                ),
                $$('button').addClass('btn sc-np-btn').append(
                    [
                        $$('i').addClass('fa fa-sign-in'),
                        this.getLabel('Login')
                    ]
                ).on('click', this.doLogin)
            ]
        )

        if (this.state.error) {
            form.append($$('div').append($$(FontAwesomeIcon, {icon: 'fa-warning'})).append(this.getLabel(this.state.error)))
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
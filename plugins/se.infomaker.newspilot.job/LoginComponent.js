import {Component, FontAwesomeIcon} from "substance";
import Auth from "./Auth";

export default class LoginComponent extends Component {

    didMount() {
        if (typeof window.GetNewspilotLogin === 'function') {
            const user = window.GetNewspilotLogin()
            const password = window.GetNewspilotPassword()
            this.doLogin(user, password)
        }
    }

    render($$) {
        const el = $$('div').addClass('login-form');


        if (typeof window.GetNewspilotLogin === 'function') {
            el.append(this.getLabel("Logging in, please wait"))
        } else {

            const form =
                $$('form').on('submit', this.postForm)

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
                    ).on('click', this.postForm)
                ]
            )

            if (this.state.error) {
                form.append($$('div').append($$(FontAwesomeIcon, {icon: 'fa-warning'})).append(this.getLabel(this.state.error)))
            }

            el.append(form)
        }

        return el;
    }

    postForm(e) {
        e.preventDefault();
        let user = this.refs.user.val()
        let password = this.refs.password.val()

        this.doLogin(user, password)

        return false
    }

    doLogin(user, password) {
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

    }

}
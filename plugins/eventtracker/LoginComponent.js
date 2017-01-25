import {Component} from 'substance'

class LoginComponent extends Component {


    render($$) {
        const el = $$('div').addClass('form-group col-12')
        const label = $$('span').append('Ange ett användarnamn')
        const name = $$('input').attr('type', 'text').addClass('form-control').ref('username')
        el.append([
            label,
            name,
        ])

        return el
    }

    onClose(action) {
        if('save' === action) {
            this.props.login(this.refs.username.val())
        }
    }
}
export default LoginComponent
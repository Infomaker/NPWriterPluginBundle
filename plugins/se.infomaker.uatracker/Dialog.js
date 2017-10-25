import {Component} from 'substance'


class Dialog extends Component {

    render($$) {
        const el = $$('div').append(
            $$('p').append(this.props.message)
        )
        return el
    }

    onClose() {
        console.log('dialog closing')
    }

}
export default Dialog

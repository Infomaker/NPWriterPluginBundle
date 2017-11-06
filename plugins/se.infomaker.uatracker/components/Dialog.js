import { Component } from 'substance'


class Dialog extends Component {
    render($$) {
        return $$('div', { class: 'uatracker-dialog' },
            $$('p', { class: 'message'}, this.props.message)
        )
    }

    // Dialog needs an onClose method to close
    onClose() {}
}

export default Dialog

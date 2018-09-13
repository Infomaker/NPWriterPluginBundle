import { Component } from 'substance'


class Dialog extends Component {
    render($$) {
        return $$('div', { class: 'imidtracker-dialog' },
            $$('p', { class: 'message'}, this.props.message)
        )
    }

    // Dialog needs an onClose method to close
    onClose(action) {
        if (action === 'save' && typeof this.props.cbPrimary === 'function') {
            this.props.cbPrimary()
        } else if (action === 'cancel' && typeof this.props.cbSecondary === 'function') {
            this.props.cbSecondary()
        }
    }
}

export default Dialog

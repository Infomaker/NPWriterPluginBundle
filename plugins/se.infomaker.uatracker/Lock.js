import { Component, FontAwesomeIcon } from 'substance'
import { api } from 'writer'

class Lock extends Component {


    render($$) {
        const el = $$('div').addClass('lock-container')

        if (this.props.lockedBy === this.props.socketId) {
            el.append(this._renderLockedByActiveUser($$))
        } else if(this.props.lockedBy) {
            el.append(this._renderLocked($$))
        } else {
            el.append(this._renderUnlocked($$))
        }

        return el
    }

    _renderLockedByActiveUser($$) {
        const lockButton = $$('button')
            .addClass('btn lock-button')
            .append($$(FontAwesomeIcon, {icon: 'fa-lock'}))
        return lockButton
    }

    _renderLocked($$) {
        const lockButton = $$('button')
            .addClass('btn lock-button locked')
            .append($$(FontAwesomeIcon, {icon: 'fa-lock'}))
        return lockButton
    }

    _renderUnlocked($$) {
        const lockButton = $$('button')
            .addClass('btn lock-button')
            .append($$(FontAwesomeIcon, {icon: 'fa-unlock-alt'}))

        return lockButton
    }
}

export default Lock

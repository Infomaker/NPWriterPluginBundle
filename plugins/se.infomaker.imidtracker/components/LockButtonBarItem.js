import { Component, FontAwesomeIcon } from 'substance'

import Popover from './Popover'
import UnlockAlert from './UnlockAlert'

class LockButton extends Component {

    togglePopover() {
        this.refs.popover.toggle()
    }

    closePopover() {
        this.refs.popover.close()
    }

    render($$) {
        return $$('div', { class: 'lock-container'}, [
            this._renderLockButton($$),
            this._renderPopover($$)
        ]).ref('lock-container')
    }

    _renderLockButton($$) {
        let classNames
        let lockIcon
        let onClick

        if (this.props.lockedBy === this.props.socketId) {
            // Article is locked by active user
            classNames = 'btn lock-button'
            lockIcon = 'fa-lock'
            onClick = () => {}

        } else if(this.props.lockedBy) {
            // Article is locked by some other user
            classNames = 'btn lock-button locked'
            lockIcon = 'fa-lock'
            onClick = this.togglePopover.bind(this)

        } else {
            // Article is locked
            classNames = 'btn lock-button'
            lockIcon = 'fa-unlock-alt'
            onClick = () => {}
        }

        return $$('button', { class: classNames},
            $$(FontAwesomeIcon, {icon: lockIcon})
        ).on('click', onClick).ref('lock-button')
    }

    _renderPopover($$) {
        return $$(Popover, {
            content: $$(UnlockAlert, {
                onUnlock: () => {
                    this.props.reserveArticle()
                    this.closePopover()
                },
                onCancel: this.closePopover.bind(this)
            })
        }).ref('popover')
    }
}

export default LockButton

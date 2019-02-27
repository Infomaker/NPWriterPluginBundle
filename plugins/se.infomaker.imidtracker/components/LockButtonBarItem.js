import {Component, FontAwesomeIcon} from 'substance'

import {IMIDPopoverComponent} from './IMIDPopoverComponent'
import {IMIDUnlockAlert} from './IMIDUnlockAlert'

class LockButtonBarItem extends Component {

    togglePopover() {
        this.refs.popover.toggle()
    }

    closePopover() {
        this.refs.popover.close()
    }

    render($$) {
        return $$('div', {class: 'lock-container'}, [
            this._renderLockButton($$),
            this._renderPopover($$)
        ]).ref('lock-container')
    }

    _renderLockButton($$) {
        let classNames
        let lockIcon
        let onClick
        let disabled = true

        if (this.props.lockedBy === this.props.socketId) {
            // Article is locked by active user
            classNames = 'btn lock-button disabled'
            lockIcon = 'fa-lock'
            onClick = () => {
            }

        }
        else if (this.props.lockedBy) {
            // Article is locked by some other user
            classNames = 'btn lock-button locked'
            lockIcon = 'fa-lock'
            disabled = false
            onClick = this.togglePopover.bind(this)

        }
        else {
            // Article is locked
            classNames = 'btn lock-button disabled'
            lockIcon = 'fa-unlock-alt'
            onClick = () => {
            }
        }

        const button = $$('button', {class: classNames},
            $$(FontAwesomeIcon, {icon: lockIcon})
        ).on('click', onClick).ref('lock-button')

        if(disabled) {
            button.attr('disabled', 'disabled')
        }

        return button
    }

    _renderPopover($$) {
        return $$(IMIDPopoverComponent, {
            id: 'logged-in-user',
            content: $$(IMIDUnlockAlert, {
                onUnlock: () => {
                    this.props.reserveArticle()
                    this.closePopover()
                },
                onCancel: this.closePopover.bind(this)
            })
        }).ref('popover')
    }
}

export {LockButtonBarItem}

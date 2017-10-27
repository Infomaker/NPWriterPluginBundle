import {Component} from 'substance'
import {api} from 'writer'

import Popover from './Popover'
import UserDetails from './UserDetails';


class UserItem extends Component {

    shouldRerender(newProps, newState) {
        return this.state.hasLock !== newState.hasLock;
    }

    didUpdate() {
        if (this.props.lockedBy === this.props.user.socketId) {
            if (!this.state.hasLock) {
                this.extendState({ hasLock: true })
            }
        } else if (this.state.hasLock) {
            this.extendState({ hasLock: false })
        }
    }

    openPopover() {
        this.refs.popover.open()
    }

    closePopover() {
        this.refs.popover.close()
    }

    render($$) {
        const user = this.props.user
        const Avatar = api.ui.getComponent('avatar')

        const itemClassNames = ['user-list-item']

        if (this.state.hasLock) {
            itemClassNames.push('active')
        }

        return $$('li', { class: itemClassNames.join(' ')},
            [
                $$(Avatar, {
                    avatarSource: 'gravatar',
                    avatarId: user.email,
                    avatarAlt: this.extractUserInitials(user)
                }).ref('avatar-' + user.socketId),

                $$('div', { class: 'status-indicator' }),

                this._renderPopover($$, user)
            ]
        ).on('mouseenter', () => {
            clearTimeout(this.closePopoverTimeout)
            this.openPopover()
        }).on('mouseleave', () => {
            this.closePopoverTimeout= setTimeout(() => this.closePopover(), 50)
        })
    }

    _renderPopover($$, user) {
        const popover = $$(Popover, {
            sticky: false,
            content: $$(UserDetails, { user: user, logout: this.props.logout })
        }).ref('popover')
        return popover
    }

    extractUserInitials(user, limit) {
        limit = limit || 2
        const nameSplit = user.name.split(' ')
        let initials = ''
        for (let i = 0; i < nameSplit.length; i++) {
            if (i >= limit) { break }
            initials += nameSplit[i][0]
        }

        return initials
    }
}

export default UserItem

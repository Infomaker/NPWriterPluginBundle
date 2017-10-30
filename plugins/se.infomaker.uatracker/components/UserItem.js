import {Component} from 'substance'
import {api} from 'writer'

import Popover from './Popover'
import UserDetails from './UserDetails';

/**
 * Renders a single user item to be used in the user list
 *
 * @class UserItem
 * @extends {Component}
 * @property {Object} props
 * @property {User} props.user - User object to display
 * @property {string} props.lockedBy - Socket ID of user who currently has the article locked
 * @property {function} [props.logout] - Callback to run when logout button pressed
 * @example
    $$(UserItem, {
        user: {
            isActiveUser: false,
            name: 'Example User',
            email: 'example.user@infomaker.se,
            timestamp: '1509361376933',
            socketId: '50w2YflUWbV2-sM6AABW',
            uuid: 'd92cb6aa-d444-4f99-ae22-61ba2691b09f',
            customerKey: 'im-writer'
        },
        lockedBy: '50w2YflUWbV2-sM6AABW',
        logout: () => console.log('Logging out')
    })
 */
class UserItem extends Component {

    shouldRerender(newProps, newState) {
        return this.state.hasLock !== newState.hasLock
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

    getInitialState() {
        return {
            hasLock: this.props.lockedBy === this.props.user.socketId
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

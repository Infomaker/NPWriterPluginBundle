import {Component} from 'substance'
import { api, moment} from 'writer'

class User extends Component {

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

    render($$) {
        const user = this.props.user
        const Avatar = api.ui.getComponent('avatar')

        const item = $$('li').addClass('user-list-item')

        // const userHasLock = user.socketId === this.props.lockedBy

        if (this.state.hasLock) { item.addClass('active') }

        const avatarEl = $$(Avatar, {
            avatarSource: 'gravatar',
            avatarId: user.email,
            avatarAlt: this.extractUserInitials(user)
        }).ref('avatar-' + user.socketId)

        const statusIndicator = $$('div').addClass('status-indicator')

        item.append([avatarEl, statusIndicator])

        return item
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

export default User

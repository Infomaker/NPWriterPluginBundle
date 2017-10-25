import {Component} from 'substance'
import { api, moment} from 'writer'

class UserList extends Component {

    // shouldRerender() {
    //     // Should never have to rerender since component is recreated every time UATracker rerenders
    //     return false;
    // }

    render($$) {
        const userList = $$('ul').addClass('user-list')

        const Avatar = api.ui.getComponent('avatar')
        const activeUser = this.props.users.find(user => user.socketId === this.props.socketId)
        const otherUsers = this.props.users.filter(user => user.socketId !== this.props.socketId)

        const userElems = otherUsers.map(user => this._renderUserElem($$, Avatar, user))
        userList.append(userElems)

        // If there are other users, add a separator
        if (otherUsers.length) {
            userList.append($$('li').addClass('user-list-item separator'))
        }

        // Add active user to end of list
        if (activeUser) {
            userList.append(this._renderUserElem($$, Avatar, activeUser))
        }

        return userList
    }

    _renderUserElem($$, Avatar, user) {
        const item = $$('li').addClass('user-list-item').ref('user-item-' + user.socketId)

        const userHasLock = user.socketId === this.props.lockedBy

        if (userHasLock) { item.addClass('active') }

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
        console.log('limit', limit)
        for (let i = 0; i < nameSplit.length; i++) {
            if (i >= limit) { break }
            initials += nameSplit[i][0]
        }

        return initials
    }
}

export default UserList

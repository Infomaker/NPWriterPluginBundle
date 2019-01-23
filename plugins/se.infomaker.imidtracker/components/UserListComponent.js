import {Component} from 'substance'
import {UserItemComponent} from './UserItemComponent'

/**
 * Renders the list of users shown in the top bar
 *
 * @class UserListComponent
 * @extends {Component}
 * @property {Object} props
 * @property {User[]} props.users - Array of user objects to display in the list
 * @property {string} props.socketId - Socket ID of the current user
 * @property {string} props.lockedBy - Socket ID of user who currently has the article locked
 * @property {number} props.limit - Amount of users to show
 * @property {function} props.logout - Callback to run when logout button pressed
 */
class UserListComponent extends Component {

    render($$) {
        const activeUser = this.props.users.find(user => user.socketId === this.props.socketId)
        let otherUsers = this.props.users
            .filter(user => user.socketId !== this.props.socketId)
            .sort(this.sortUsers.bind(this))

        let additionalUsersElem = null

        if (otherUsers.length > this.props.limit) {
            const overflow = otherUsers.length - this.props.limit

            // Limit amount of users shown
            otherUsers = otherUsers.slice(overflow)

            additionalUsersElem = $$('li', {
                class: 'user-list-item additional-users',
                title: overflow + ' additional users'
            }, '+' + overflow)
        }

        // If there are other users, add a separator
        const separatorElem = otherUsers.length ? $$('li').addClass('user-list-item separator') : null

        return $$('ul', {class: 'user-list'},
            [
                additionalUsersElem,

                ...otherUsers.map(user => $$(UserItemComponent, {
                    user: user,
                    lockedBy: this.props.lockedBy
                }).ref('user-item-' + user.socketId)),

                separatorElem,

                // Add active user to end of list
                $$(UserItemComponent, {
                    user: activeUser,
                    lockedBy: this.props.lockedBy,
                    logout: this.props.logout
                }).ref('user-item-active')

            ]
        ).ref('user-list')
    }

    sortUsers(a, b) {
        return this.getUserValue(a) - this.getUserValue(b)
    }

    getUserValue(user) {
        return user.socketId === this.props.lockedBy ? 1 : 0
    }
}

export {UserListComponent}

import {Component} from 'substance'
import { api, moment} from 'writer'

import UserItem from './UserItem'

class UserList extends Component {

    render($$) {

        const activeUser = this.props.users.find(user => user.socketId === this.props.socketId)
        const otherUsers = this.props.users.filter(user => user.socketId !== this.props.socketId)

        // If there are other users, add a separator
        const separatorElem = otherUsers.length ? $$('li').addClass('user-list-item separator') : null

        return $$('ul', { class: 'user-list'},
            [
                ...otherUsers.map(user => $$(UserItem, {
                    user: user,
                    lockedBy: this.props.lockedBy
                }).ref('user-item-' + user.socketId)),

                separatorElem,

                // Add active user to end of list
                $$(UserItem, {
                    user: activeUser,
                    lockedBy: this.props.lockedBy,
                    logout: this.props.logout
                }).ref('user-item-active')

            ]
        ).ref('user-list')
    }

    __render($$) {
        const userList = $$('ul').addClass('user-list').ref('user-list')

        const activeUser = this.props.users.find(user => user.socketId === this.props.socketId)
        const otherUsers = this.props.users.filter(user => user.socketId !== this.props.socketId)

        const userElems = otherUsers.map(user => $$(UserItem, {
            user: user,
            lockedBy: this.props.lockedBy
        }).ref('user-item-' + user.socketId))
        userList.append(userElems)

        // If there are other users, add a separator
        if (otherUsers.length) {
            userList.append($$('li').addClass('user-list-item separator'))
        }

        // Add active user to end of list
        if (activeUser) {
            userList.append($$(UserItem, {
                user: activeUser,
                lockedBy: this.props.lockedBy,
                logout: this.props.logout
            }).ref('user-item-active'))
        }

        return userList
    }
}

export default UserList

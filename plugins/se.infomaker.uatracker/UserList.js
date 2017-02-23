import {Component} from 'substance'
import { api, moment} from 'writer'

class UserList extends Component {

    render($$) {
        const el = $$('div')
        el.append($$('h2').append(this.getLabel('connected-users-headline')))
        el.append($$('p').append(this.getLabel('connected-users-description')))

        const Avatar = api.ui.getComponent('avatar')

        const userList = $$('ul').addClass('user-list authors__list')
        const userEls = this.props.users.map((user) => {
            const item = $$('li').addClass('authors__list-item')
            const avatarEl = $$(Avatar, {avatarSource: 'gravatar', avatarId: user.email}).ref('avatar-'+user.socketId)

            const nameEl = $$('span').addClass('author__name meta').append(user.name)
            const emailEl = $$('span').addClass('author__email').append(user.email)

            const container = $$('div').addClass('metadata__container')
            if (user.socketId === this.props.socketId) {
                item.addClass('current')
                nameEl.append(this.getLabel('(You)'))
                // container.append($$('span').addClass('active-user').append(this.getLabel('(You)')))

            }
            container.append($$('span').addClass('active-user').append(moment(Number(user.timestamp)).fromNow()))

            item.append([
                avatarEl,
                container.append([
                    nameEl,
                    emailEl
                ])
            ])


            return item
        })
        userList.append(userEls)
        el.append(userList)

        return el
    }
}

export default UserList
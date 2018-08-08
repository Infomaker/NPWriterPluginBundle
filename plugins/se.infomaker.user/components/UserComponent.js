import {Component} from 'substance'
import {api, ConceptService} from 'writer'
import {AuthorDialogComponent} from './AuthorDialogComponent'

class UserComponent extends Component {

    didMount() {
        this._getUserState()
            .then(({userInfo, authorInfo}) => {
                this.extendState({
                    userInfo,
                    authorInfo
                })
            })
    }

    getInitialState() {
        return {
            userInfo: null,
            authorInfo: null
        }
    }

    render($$) {
        console.log(this.state)
        if (this.state.userInfo && !this.state.authorInfo) {
            api.ui.showDialog(AuthorDialogComponent,
                {
                    ...this.state.userInfo
                },
                {
                    title: this.getLabel('Add to image byline'),
                    global: true,
                    primary: false,
                    secondary: false
                })
        }

        return $$('div')
    }

    async _getUserState() {

        const userInfo = await api.user.getUserInfo()
        const authorInfo = await ConceptService.getAuthorConceptBySub(userInfo.sub)

        console.log(userInfo.sub)

        return {userInfo, authorInfo}
    }

}

export {UserComponent}

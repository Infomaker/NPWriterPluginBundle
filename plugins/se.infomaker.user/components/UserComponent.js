import {Component} from 'substance'
import {api, ConceptService} from 'writer'

class UserComponent extends Component {

    didMount() {
        this._getUserState()
            .then((sub) => {
                this.extendState({
                    sub
                })
            })
    }

    getInitialState() {
        return {
            sub: null
        }
    }

    render($$) {
        if(this.state.sub) {
            api.ui.showConfirmDialog('Verify author',
                this.state.sub.name,
                {
                    primary: {
                        label: 'Jag e ja',
                        callback: () => {
                            console.info('det e ja')
                        }
                    },
                    secondary: {
                        label: 'Jag e inte ja',
                        callback: () => {
                            console.info('det e inte ja')
                        }
                    }
                })
        }

        return $$('div')
    }

    async _getUserState() {

        const userInfo = await api.user.getUserInfo()

        const authorConcept = await ConceptService.getAuthorConceptBySub(userInfo.sub)

        return authorConcept
    }

}

export {UserComponent}

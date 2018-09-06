import {Component} from 'substance'
import {api, ConceptService} from 'writer'
import {AuthorDialogComponent} from './AuthorDialogComponent'

class UserBylineComponent extends Component {

    constructor(...args) {
        super(...args)

        this.addAuthor = this.addAuthor.bind(this)
    }

    async didMount() {
        const { userInfo, authorInfo } = await this.getUserState()
        const { propertyMap } = this.state

        const suggestions = await ConceptService.search(`${propertyMap.ConceptAuthorEmail}:${userInfo.email}`)

        this.extendState({
            userInfo,
            authorInfo,
            suggestions
        })
    }

    getInitialState() {
        return {
            userInfo: null,
            authorInfo: null,
            suggestions: [],
            propertyMap: ConceptService.getPropertyMap()
        }
    }

    addAuthor(author) {
        // const { sub } = this.props
        // const { propertyMap } = this.state

        // author[propertyMap.ConceptSubscriberId] = sub

        ConceptService.trigger(
            ConceptService.operations.ADD,
            author
        )

        ConceptService.trigger(
            ConceptService.operations.UPDATE,
            author
        )

        this.send('dialog:close')
    }

    render($$) {
        const { suggestions, propertyMap } = this.state
        console.info('UserBylineComponent::render ', this.state)

        if (!api.newsItem.getGuid()) {
            if (this.state.userInfo && !this.state.authorInfo) {
                api.ui.showDialog(AuthorDialogComponent,
                    {
                        ...this.state.userInfo,
                        suggestions,
                        propertyMap,
                        addAuthor: this.addAuthor,
                    },
                    {
                        title: this.getLabel('Add to image byline'),
                        global: true,
                        primary: false,
                        secondary: false
                    }
                )
            }
        }

        return $$('div')
    }

    async getUserState() {
        const userInfo = await api.user.getUserInfo()
        const authorInfo = await ConceptService.getRemoteConceptBySub(userInfo.sub)

        return {userInfo, authorInfo}
    }

}

export {UserBylineComponent}

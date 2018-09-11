import {Component} from 'substance'
import {api, ConceptService} from 'writer'
import {AuthorDialogComponent} from './AuthorDialogComponent'

class UserBylineComponent extends Component {

    constructor(...args) {
        super(...args)

        this.addAuthor = this.addAuthor.bind(this)
    }

    async didMount() {
        // If we are looking at a new article eg. no guid
        if (!api.newsItem.getGuid()) {
            const { userInfo, authorInfo } = await this.getUserState()
            const propertyMap = ConceptService.getPropertyMap()
            let suggestions = []

            if (authorInfo) {
                this.addAuthor(authorInfo)
                this.send('dialog:close')
            } else {
                suggestions = await ConceptService.search(`${propertyMap.ConceptAuthorEmail}:${userInfo.email}`)
            }

            this.extendState({
                userInfo,
                authorInfo,
                suggestions,
                propertyMap
            })
        }
    }

    async getUserState() {
        const userInfo = await api.user.getUserInfo()
        const authorInfo = await ConceptService.getRemoteConceptBySub(userInfo.sub)

        return { userInfo, authorInfo }
    }

    /**
     * Will set IM.ID user connected author-concept as byline
     *
     * @param {object} author
     */
    async addAuthor(author) {
        const { sub } = this.state.userInfo
        const { propertyMap } = this.state

        if (!author[propertyMap.ConceptImIdSubjectId]) {
            author[propertyMap.ConceptImIdSubjectId] = sub

            await this.updateAuthorConcept(author)
        }

        ConceptService.trigger(
            ConceptService.operations.ADD,
            author
        )
    }

    /**
     * Will update user XML in repo
     *
     * @param {object} author
     */
    async updateAuthorConcept(author) {
        // const conceptXml = await ConceptService.getConceptItemXml(author)
        // const conceptItemConfig = await ConceptService.getConceptItemConfigJson(author)
        // const subjectIdXpath = conceptItemConfig.instructions.imid.sub
    }

    getInitialState() {
        return {
            userInfo: null,
            authorInfo: null,
            suggestions: []
        }
    }

    render($$) {
        const { suggestions, propertyMap } = this.state

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

        return $$('div')
    }
}

export {UserBylineComponent}

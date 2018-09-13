import {Component} from 'substance'
import {api, ConceptService} from 'writer'
import {AuthorDialogComponent} from './AuthorDialogComponent'
import XmlHandler from '@infomaker/xml-handler'

class UserBylineComponent extends Component {

    constructor(...args) {
        super(...args)

        this.addImidUserToArticleByline = this.addImidUserToArticleByline.bind(this)
    }

    async didMount() {

        /**
         * If we are looking at a new article eg. no guid
         * this workflow should kick in
         */
        if (!api.newsItem.getGuid()) {
            const { userInfo, authorInfo } = await this.loadUserState()
            const propertyMap = this.state.propertyMap

            if (authorInfo) {
                this.addImidUserToArticleByline(authorInfo)
            } else {
                const suggestions = await ConceptService.search(`${propertyMap.ConceptAuthorEmail}:${userInfo.email}`)
                this.displayModal(suggestions)
            }
        }
    }

    /**
     * Method to open a writer modal with a list of suggested authors
     *
     * @param {array} suggestions array with concept suggestions
     */
    displayModal(suggestions) {
        const {propertyMap} = this.state
        if (this.state.userInfo && !this.state.authorInfo) {
            api.ui.showDialog(AuthorDialogComponent,
                {
                    ...this.state.userInfo,
                    suggestions,
                    propertyMap,
                    addImidUserToArticleByline: this.addImidUserToArticleByline,
                },
                {
                    title: this.getLabel('Add author to byline'),
                    global: true,
                    primary: false,
                    secondary: false
                }
            )
        }
    }

    /**
     * Load IMID user info from writer and
     * try to load corresponding author from OC
     *
     * @returns {object} With userInfo and authorInfo
     */
    async loadUserState() {
        const userInfo = await api.user.getUserInfo()
        const authorInfo = await ConceptService.getRemoteConceptBySub(userInfo.sub)

        await this.extendState({ userInfo, authorInfo })

        return { userInfo, authorInfo }
    }

    /**
     * Will set IM.ID connected author-concept as byline
     *
     * @param {object} author
     */
    async addImidUserToArticleByline(author) {
        const { sub } = this.state.userInfo
        const { propertyMap } = this.state

        if (!author[propertyMap.ConceptImIdSubjectId]) {
            await this.addSubToAuthorXml(author, sub)
        }

        // TODO: Decorate author according to instructions in config
        ConceptService.addArticleConcept(author, false)
    }

    /**
     * Will update author XML with sub in OC
     *
     * @param {object} author concept
     */
    async addSubToAuthorXml(author, sub) {
        const conceptXml = await ConceptService.getConceptItemXml(author)
        const conceptItemConfig = await ConceptService.getConceptItemConfigJson(author)
        const subInstruction = conceptItemConfig.instructions.imid ?
            conceptItemConfig.instructions.imid.find(instruction => instruction.name === 'sameas-imid-sub') :
            null

        const subXpath = (subInstruction && subInstruction.xpath) ? subInstruction && subInstruction.xpath : null

        if (sub && conceptXml && subXpath) {
            const xmlHandler = new XmlHandler(conceptXml)
            let subNode = xmlHandler.getNode(subXpath)

            if (!subNode || !subNode.singleNodeValue) {
                xmlHandler.createNodes(subXpath)
                subNode = xmlHandler.getNode(subXpath)
            }

            xmlHandler.setNodeValue(subNode, `imid://user/sub/${sub}`)
            const xmlString = new XMLSerializer()
                .serializeToString(conceptXml.documentElement)
                .trim()
                .replace(/ xmlns=""/g, '')

            await ConceptService.updateConceptItemXml(author.uuid, xmlString)
        }
    }

    getInitialState() {
        return {
            userInfo: null,
            authorInfo: null,
            suggestions: [],
            propertyMap: ConceptService.getPropertyMap()
        }
    }

    render($$) {
        return $$('div')
    }
}

export {UserBylineComponent}

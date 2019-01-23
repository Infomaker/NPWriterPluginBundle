import {Component} from 'substance'
import {api, ConceptService} from 'writer'
import {AuthorDialogComponent} from './AuthorDialogComponent'
import XmlHandler from '@infomaker/xml-handler'

class UserBylineComponent extends Component {

    constructor(...args) {
        super(...args)

        this.reloadList = this.reloadList.bind(this)
        this.addImidUserToArticleByline = this.addImidUserToArticleByline.bind(this)
        this.addSubToAuthorXml = this.addSubToAuthorXml.bind(this)
    }

    async reloadList() {
        const { userInfo } = await this.loadUserState()
        const { propertyMap } = this.state
        const suggestions = await ConceptService.search(`${propertyMap.ConceptAuthorEmail}:${userInfo.email}`)

        this.modalReloadFunction(suggestions)
    }

    async didMount() {

        /**
         * If we are looking at a new article eg. no guid
         * this workflow should kick in
         */
        if (!api.newsItem.getGuid()) {
            const { userInfo, authorInfo } = await this.loadUserState()
            const { propertyMap } = this.state

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
        const { propertyMap } = this.state

        if (this.state.userInfo && !this.state.authorInfo) {
            const optional = api.getConfigValue('se.infomaker.user-byline', 'optional', false)

            api.ui.showDialog(AuthorDialogComponent,
                {
                    ...this.state.userInfo,
                    suggestions,
                    propertyMap,
                    supportEmail: api.getConfigValue('se.infomaker.user-byline', 'supportEmail', false),
                    reloadList: this.reloadList,
                    setReloadFunction: (reloadFunction) => {
                        this.modalReloadFunction = reloadFunction
                    },

                    addImidUserToArticleByline: this.addImidUserToArticleByline,
                },
                {
                    // title: this.getLabel('Add author to byline'),
                    global: true,
                    primary: false,
                    secondary: optional ? this.getLabel('Later') : false,
                    tertiary: [
                        {
                            caption: this.getLabel('Refresh list'),
                            callback: () => {
                                this.reloadList()
                                return false;
                            }
                        }
                    ]
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

        this.authorConfig = await ConceptService.getConceptItemConfigJson(author)
        this.authorXml = await ConceptService.getConceptItemXml(author)
        this.xmlHandler = new XmlHandler(this.authorXml)

        if (!author[propertyMap.ConceptImIdSubjectId]) {
            await this.addSubToAuthorXml(author, sub)
        }

        const articleDataInstructions = (this.authorConfig && this.authorConfig.instructions) ?
            this.authorConfig.instructions.articleData :
            null

        if (articleDataInstructions) {
            author.articleData = articleDataInstructions.reduce((accumulator, prop) => {
                accumulator[prop.name] = this.xmlHandler.getNodeValue(this.xmlHandler.getNode(prop.xpath))
                return accumulator
            }, {})
        }

        ConceptService.addArticleConcept(author, false)
    }

    /**
     * Will update author XML with sub in OC
     *
     * @param {object} author concept
     */
    async addSubToAuthorXml(author, sub) {
        const subInstruction = (this.authorConfig.instructions && this.authorConfig.instructions.imid) ?
            this.authorConfig.instructions.imid.find(instruction => instruction.name === 'sameas-imid-sub') :
            null

        const subXpath = (subInstruction && subInstruction.xpath) ? subInstruction && subInstruction.xpath : null

        if (sub && subXpath && this.authorXml) {
            let subNode = this.xmlHandler.getNode(subXpath)

            if (!subNode || !subNode.singleNodeValue) {
                this.xmlHandler.createNodes(subXpath)
                subNode = this.xmlHandler.getNode(subXpath)
            }

            this.xmlHandler.setNodeValue(subNode, `imid://user/sub/${sub}`)
            const xmlString = new XMLSerializer()
                .serializeToString(this.authorXml.documentElement)
                .trim()
                .replace(/ xmlns=""/g, '')

            await ConceptService.updateConceptItemXml(author.uuid, xmlString)
        }
    }

    getInitialState() {
        return {
            userInfo: null,
            authorInfo: null,
            propertyMap: ConceptService.getPropertyMap()
        }
    }

    render($$) {
        return $$('div')
    }
}

export {UserBylineComponent}

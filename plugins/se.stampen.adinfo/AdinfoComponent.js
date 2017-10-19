import { Component } from 'substance'
import { api, idGenerator } from 'writer'
import KeywordsComponent from './KeywordsComponent'
import CampaignIdComponent from './CampaignIdComponent'


class AdinfoComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'adinfo'
    }

    getInitialState() {
        const adinfoMetaObjects = api.newsItem.getContentMetaObjectsByType('x-im/adinfo')

        if (adinfoMetaObjects) {
            let adinfoMetaObject = adinfoMetaObjects[0]
            const keywordsArray = adinfoMetaObject.data.keywords.keyword
            let keywords
            if (keywordsArray) {
                keywords = Array.isArray(keywordsArray) ? keywordsArray : [keywordsArray]
            } else {
                keywords = []
            }

            return {
                id: adinfoMetaObject['@id'],
                keywords: keywords,
                campaignId: adinfoMetaObject.data.campaignId
            }
        } else {
            return {
                id: idGenerator(),
                keywords: [],
                campaignId: ''
            }
        }
    }

    render($$) {
        const el = $$('div').addClass(this.name)

        const keywordsComponent = $$(KeywordsComponent, {
            keywords: this.state.keywords,
            removeKeyword: this.removeKeyword.bind(this),
            addKeywords: this.addKeywords.bind(this)
        }).ref('keywordsComponent')

        const campaignIdComponent = $$(CampaignIdComponent, {
            campaignId: this.state.campaignId,
            setCampaignId: this.setCampaignId.bind(this)
        }).ref('campaignIdComponent')

        el.append([keywordsComponent, campaignIdComponent])

        return el
    }

    /**
     * Add the specified keyword to the components state as long as it does not already exist
     * @param {string} keyword
     */
    addKeyword(keyword) {
        keyword = keyword.trim()
        const currentKeywords = this.state.keywords.slice()
        if (currentKeywords.includes(keyword)) { return }

        currentKeywords.push(keyword)
        this.extendState({
            keywords: currentKeywords
        })

        this.saveState()
    }

    /**
     * Add the specified keywords to the components state as long as it they do not already exist
     * @param {string[]} keyword
     */
    addKeywords(keywords) {
        const currentKeywords = this.state.keywords.slice()
        keywords.forEach(keyword => {
            keyword = keyword.trim()
            if (currentKeywords.includes(keyword)) { return }
            currentKeywords.push(keyword)
        })

        this.extendState({
            keywords: currentKeywords
        })

        this.saveState()
    }

    /**
     * Remove the specified keyword to the components state
     * @param {string} keyword
     */
    removeKeyword(keyword) {
        this.extendState({
            keywords: this.state.keywords.filter((word) => word !== keyword)
        })
        this.saveState()
    }

    /**
     * Set campaignId in the components state
     * @param {string} campaignId
     */
    setCampaignId(campaignId) {
        this.extendState({
            campaignId: campaignId.trim()
        })
        this.saveState()
    }

    /**
     * Save the components state to newsml as object in <contentMeta />
     */
    saveState() {
        const data = {}

        if (this.state.keywords.length > 0) {
            data.keywords = {}
            data.keywords.keyword = this.state.keywords
        }

        if (this.state.campaignId) {
            data.campaignId = this.state.campaignId
        }

        const hasData = Object.keys(data).length > 0

        if (hasData) {
            api.newsItem.setContentMetaObject(this.name, {
                '@id': this.state.id,
                '@type': `x-im/${this.name}`,
                data
            })
        } else {
            api.newsItem.removeContentMetaObject(this.name, this.state.id)
        }
    }
}

export default AdinfoComponent

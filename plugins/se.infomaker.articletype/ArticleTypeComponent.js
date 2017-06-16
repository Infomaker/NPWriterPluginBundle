import {Component} from "substance"
import {api} from "writer"

class ArticleTypeComponent extends Component {

    constructor(...args) {
        super(...args)
        this.setupConfig()
    }

    /**
     * Setup config for plugin
     */
    setupConfig() {
        this.pluginName = 'articletype'
        this.linkType = 'x-im/' + this.pluginName.toLocaleLowerCase()
        this.linkRel = this.pluginName.toLocaleLowerCase()
        this.linkUri = 'im://' + this.pluginName.toLocaleLowerCase() + '/'
        this.options = this.context.api.getConfigValue('se.infomaker.articletype', 'articletypes')
    }

    /**
     * Initial state
     *
     * @returns {{articletype: string}}
     */
    getInitialState() {
        this.setupConfig()
        const existingArticleTypeLinks = api.newsItem.getContentMetaLinkByType(this.pluginName, this.linkType)

        let articleType = ''
        if (existingArticleTypeLinks && existingArticleTypeLinks.length > 0) {
            const articleTypeLink = existingArticleTypeLinks[0]["@uri"].split('/').pop()
            for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].id === articleTypeLink) {
                    articleType = this.options[i].id
                    break
                }
            }
        }

        return {
            articletype: articleType
        }
    }

    /**
     * Render options
     *
     * @param $$
     * @returns {*}
     */
    renderOptions($$) {
        const btnGroup = $$('div').addClass('btn-group btn-group-' + this.pluginName)

        Object.keys(this.options).forEach((option) => {

            const props = this.options[option]

            const btn = $$('button')
                .addClass('btn btn-secondary')
                .on('click', () => {
                    this.saveMeta(props)
                })

            if (this.state[this.pluginName] === props.id) {
                btn.addClass('active')
            }

            // Add btn label
            btn.append(props.title)

            btnGroup.append(btn)
        });

        return btnGroup
    }

    /**
     * Save meta for options
     *
     * @param articletype
     */
    saveMeta(articletype) {

        // Reset state if you click same button again
        if (this.state[this.pluginName] === articletype.id) {
            api.newsItem.removeLinkContentMetaByTypeAndRel(this.pluginName, this.linkType, this.linkRel)
            this.extendState({
                [this.pluginName]: null
            })
            return
        }

        const link = {
                '@title': articletype.title,
                '@uri': this.linkUri + articletype.id,
                '@rel': this.linkRel,
                '@type': this.linkType
            },
            existingLinks = api.newsItem.getContentMetaLinkByType(this.pluginName, this.linkType)

        // Remove existing
        if (existingLinks && existingLinks.length > 0) {
            api.newsItem.removeLinkContentMetaByTypeAndRel(this.pluginName, this.linkType, this.linkRel)
        }

        // Add new value
        api.newsItem.addContentMetaLink(this.pluginName, link)

        this.extendState({
            [this.pluginName]: articletype.id
        })
    }

    /**
     * Render plugin
     *
     * @param $$
     * @returns {*}
     */
    render($$) {
        const el = $$('div').addClass('im-' + this.pluginName),
            label = $$('h2').append(this.getLabel('articletype-label')),
            btns = this.renderOptions($$)

        el.append(label)
            .append(btns)

        return el
    }
}

export default ArticleTypeComponent
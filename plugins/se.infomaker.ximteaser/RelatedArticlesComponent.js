import { Component } from 'substance'

/**
 * @typedef RelatedArticlesComponent.Props
 * @property {RelatedArticlesComponent.Article[]} articles
 */

/**
 * @typedef RelatedArticlesComponent.Article
 * @property {string} title
 * @property {string} uuid
 */

/**
 * Renders a list of links to related articles
 *
 * @param {RelatedArticlesComponent.Props} props
 * @property {RelatedArticlesComponent.Props} props
 */
class RelatedArticlesComponent extends Component {
    constructor(...args) {
        super(...args)
    }

    /**
     * @param {function} $$ - Substance createElement
     * @returns {VirtualElement}
     */
    render($$) {
        const el = $$('div', {class: 'related-articles-container'})

        el.append(
            $$('div', {class: 'related-articles-heading'}, this.getLabel('teaser-related-articles'))
        )

        /** @type {RelatedArticlesComponent.Article[]} */
        const articles = this.props.articles

        if (articles && articles.length) {
            el.append(this._renderArticles($$, articles))
        }

        return el
    }

    /**
     * @param {function} $$ - Substance createElement
     * @param {RelatedArticlesComponent.Article[]} articles
     * @returns {VirtualElement}
     */
    _renderArticles($$, articles) {
        return articles.map(article => {
            return $$('div', {class: 'related-article'}, [
                $$('span', {class:'article-icon'},
                    $$('i', {class: 'fa fa-file-text-o'})
                ),
                $$('a', {class: 'article-title', href: `#${article.uuid}`, target: '_blank'}, article.title),
                $$('button', {class: 'article-remove'},
                    $$('i', {class: 'fa fa-remove'})
                ).on('click', () => this.props.remove(article.uuid))
            ])
        })
    }
}

export default RelatedArticlesComponent

import { Component } from 'substance'

class RelatedArticlesComponent extends Component {
    constructor(...args) {
        super(...args)
    }

    render($$) {
        const el = $$('div', {class: 'related-articles-container'})

        el.append(
            $$('div', {class: 'related-articles-heading'}, 'Relaterade artiklar')
        )

        const articles = this.props.articles



        if (articles && articles.length) {
            el.append(this._renderArticles($$, articles))
        }

        return el
    }

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

import { Component } from 'substance'
import { moment } from 'writer'
import ArticleModel from '../models/ArticleModel'

class SearchResultItem extends Component {

    /**
     * Generate dropLink
     *
     * @param {object} article ArticleModel instance
     */
    getDroplinkForItem(article) {
        const data = {
            imType: 'article',
            uuid: article.uuid[0],
            name: article.headline[0]
        }
        const dropData = encodeURIComponent(JSON.stringify(data))

        return `x-im-entity://x-im/article?data=${dropData}`
    }

    /**
     * Handle drag start
     *
     * @param {object} e event
     * @param {object} article ArticleModel instance
     */
    dragStartHandler(e, article) {
        e.stopPropagation()
        e.dataTransfer.setData('text/uri-list', this.getDroplinkForItem(article))
        setTimeout(() => {
            this.refs[`searchResultItem-instans-${article.id}`].addClass('dragging')
        })
    }

    /**
     * Handle drag end
     *
     * @param {object} article ArticleModel instance
     */
    dragEndHandler(article) {
        this.refs[`searchResultItem-instans-${article.id}`].removeClass('dragging')
    }

    render($$){
        const {item, propertyMap, icons} = this.props
        const article = new ArticleModel(item, propertyMap)
        const articleProductIcons = article.products.map(product => {
            let img = ''

            if (product) {
                const icon = icons.find(icon => icon.name.toLowerCase() === product.toLowerCase())

                if (icon) {
                    img = $$('img', { class: 'article-product-icon', src: `${icon.data}`, title: this.capitalize(product) })
                }
            }

            return img
        })

        const el = $$('div', { class: `search-result-article article_status_${article.pubstatus[0]}`, title: `${article.pubstatus.length ? article.pubstatus[0] : ''}`, draggable: "true" }, [

            $$('div', { class: `search-result-article_inner has_publiched_version_${article.hasPublishedVersion[0]}` }, [

                $$('div', { class: 'article-header' }, [
                    $$('div', { class: 'article-header-meta' }, [
                        (article.premium && article.premium.length && article.premium[0] === 'true') ? $$('p', { class: 'header-meta-item premium', title: this.capitalize(propertyMap['premium']) }, 'P') : '',
                        (article.lifespan && article.lifespan.length) ? $$('p', { class: 'header-meta-item lifespan', title: this.capitalize(propertyMap['lifetime']) }, article.lifespan[0]) : '',
                        (article.newsvalue && article.newsvalue.length) ? $$('p', { class: 'header-meta-item prio', title: this.capitalize(propertyMap['newsvalue']) }, article.newsvalue[0]) : '',
                        ...articleProductIcons
                    ]),
                    $$('div', { class: 'article-header-dates' }, [
                        $$('p', { class: 'article-head-date', title: `${this.capitalize(propertyMap['updated'])}: ${moment(article.updated[0]).locale(this.props.locale).format('lll')}`}, [
                            $$('i', { class: 'fa fa-refresh'}),
                            moment(article.updated[0]).locale(this.props.locale).format('LT')
                        ]),
                        $$('p', { class: 'article-head-date', title: `${this.capitalize(propertyMap['published'])}: ${moment(article.published[0]).locale(this.props.locale).format('lll')}` }, [
                            $$('i', {class: 'fa fa-clock-o'}),
                            moment(article.published[0]).locale(this.props.locale).format('LT')
                        ]),
                    ])
                ]),

                $$('div', { class: 'article-content' }, [
                    $$('div', { class: 'article-text-wrapper', title: (article.headline[0] && article.headline[0].length) ? article.headline[0] : '-'}, [
                        $$('h2', { class: `${article.images.length ? 'with-image' : ''}`}, (article.headline[0] && article.headline[0].length) ? article.headline[0] : '-'),
                        $$('div', { class: 'article-meta' }, [
                            $$('p', { class: 'meta-data', title: this.capitalize(propertyMap['channels']) },
                                article.channels.length ? article.channels.reduce((channelString, channel) => `${channelString}${channelString.length ? ', ' : ''}${channel}`, '') : ' - '),
                            $$('p', { class: 'divider' }, ' | '),
                            $$('p', { class: 'meta-data', title: this.capitalize(propertyMap['profiles']) },
                                article.profiles.length ? article.profiles.reduce((profileString, profile) => `${profileString}${profileString.length ? ', ' : ''}${profile}`, '') : ' - '),
                            $$('p', { class: 'divider' }, ' | '),
                            $$('p', { class: 'meta-data', title: this.capitalize(propertyMap['authors']) },
                                article.authors.length ? article.authors.reduce((authorString, author) => `${authorString}${authorString.length ? ', ' : ''}${author}`, '') : ' - ')
                        ])
                    ]),
                    article.images.length ? $$('div', { class: 'article-image-wrapper' }, [
                        $$('img', { src: `${this.props.host}/${article.images[0]}/files/thumb` }),
                        article.images.length > 1 ? $$('p', { class: 'article-image-count', title: 'Image count' }, article.images.length) : ''
                    ]) : '',
                ]),
            ])
        ])
        .ref(`searchResultItem-instans-${article.id}`)
        .on('dragstart', (e) => { this.dragStartHandler(e, article) })
        .on('dragend', () => { this.dragEndHandler(article) })

        return el
    }

    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

}

export default SearchResultItem
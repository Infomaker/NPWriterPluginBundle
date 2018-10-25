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
        console.info('RENDER SearchResultItem')
        const {item, propertyMap, icons} = this.props
        const article = new ArticleModel(item, propertyMap)
        const articleChannelIcons = article.channels.map(channel => {
            let img = ''

            if (channel) {
                const icon = icons.find(icon => icon.name.toLowerCase() === channel.toLowerCase())

                if (icon) {
                    img = $$('img', { class: 'article-channel-icon', src: `${icon.data}`, title: this.capitalize(channel) })
                }
            }

            return img
        })

        const el = $$('div', { class: `search-result-article article_status_${article.pubstatus.length ? article.pubstatus[0].replace(':', '') : ''}`, title: `${article.pubstatus.length ? article.pubstatus[0] : ''}`, draggable: "true" }, [

            $$('div', { class: `search-result-article_inner has_publiched_version_${article.hasPublishedVersion[0]}` }, [

                $$('div', { class: 'article-header' }, [
                    $$('div', { class: 'article-header-meta' }, [
                        (article.premium && article.premium.length && article.premium[0] === 'true') ? $$('p', { class: 'header-meta-item premium', title: this.capitalize(propertyMap['premium']) }, 'P') : '',
                        (article.lifetime && article.lifetime.length) ? $$('p', { class: 'header-meta-item lifetime', title: this.capitalize(propertyMap['lifetime']) }, article.lifetime[0]) : '',
                        (article.newsvalue && article.newsvalue.length) ? $$('p', { class: 'header-meta-item prio', title: this.capitalize(propertyMap['newsvalue']) }, article.newsvalue[0]) : '',
                        ...articleChannelIcons
                    ]),
                    $$('div', { class: 'article-header-dates' }, [
                        $$('p', { class: 'article-head-date', title: `${this.capitalize(propertyMap['updated'])}: ${moment(article.updated[0]).locale(this.props.locale).format('lll')}`}, [
                            $$('i', { class: 'fa fa-refresh'}),
                            moment(article.updated[0]).locale(this.props.locale).calendar(moment())
                        ]),
                        $$('p', { class: 'article-head-date', title: `${this.capitalize(propertyMap['published'])}: ${moment(article.published[0]).locale(this.props.locale).format('lll')}` }, [
                            $$('i', {class: 'fa fa-clock-o'}),
                            moment(article.published[0]).locale(this.props.locale).calendar(moment())
                        ]),
                    ])
                ]),

                $$('div', { class: 'article-content' }, [
                    $$('div', { class: 'article-text-wrapper', title: (article.headline[0] && article.headline[0].length) ? article.headline[0] : '-'}, [
                        $$('h2', { class: `${article.images.length ? 'with-image' : ''}`}, (article.headline[0] && article.headline[0].length) ? article.headline[0] : '-'),
                        $$('div', { class: 'article-meta' }, [
                            $$('p', { class: 'meta-data', title: this.capitalize(propertyMap['channels']) },
                                article.sections.length ? article.sections.reduce((sectionString, section) => `${sectionString}${sectionString.length ? ', ' : ''}${section}`, '') : ' - '),
                            $$('p', { class: 'divider' }, ' | '),
                            $$('p', { class: 'meta-data', title: this.capitalize(propertyMap['profiles']) },
                                article.profiles.length ? article.profiles.reduce((profileString, profile) => `${profileString}${profileString.length ? ', ' : ''}${profile}`, '') : ' - '),
                            $$('p', { class: 'divider' }, ' | '),
                            $$('p', { class: 'meta-data', title: this.capitalize(propertyMap['authors']) },
                                article.authors.length ? article.authors.reduce((authorString, author) => `${authorString}${authorString.length ? ', ' : ''}${author}`, '') : ' - ')
                        ])
                    ]),
                    article.images.length ? $$('div', { class: 'article-image-wrapper' }, [
                        $$('img', { src: `${this.props.host}/${article.images[0]}/files/thumb` }).ref(`imageRef-${article.images[0]}`),
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

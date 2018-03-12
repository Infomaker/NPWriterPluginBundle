import {Component, FontAwesomeIcon} from 'substance'
import {api, moment} from 'writer'
import ShowVersionsComponent from './ShowVersionsComponent'
import ArticleEtagConflictComponent from "./ArticleEtagConflictComponent";

class HistoryItemComponent extends Component {

    render($$) {
        const article = this.props.article;
        const version = article.versions[article.versions.length - 1]

        let icon, title

        let articleTitle = article.id;

        let domParser = new DOMParser(),
            dom = domParser.parseFromString(version.src, 'text/xml'),
            headline = dom.querySelector('idf element[type="headline"]')

        /**
         * If headline is found use its textcontent, of not, get the first 60 characters from idf textcontent
         */
        if (headline && headline.textContent && headline.textContent.length > 2) {
            articleTitle = headline.textContent
        } else if (dom.querySelector('idf')) {
            if (dom.querySelector('idf').textContent) {
                articleTitle = dom.querySelector('idf').textContent.substr(0, 60)
            }
        }

        if (article.id.indexOf('__temp__') === 0) {
            icon = 'fa fa-hdd-o'
            title = this.getLabel('history-popover-non-existing-article')
        } else {
            icon = 'fa fa-cloud-upload'
            title = this.getLabel('history-popover-existing-article') + '- ID: ' + article.id
        }

        const outer = $$('div')
            .addClass('history-version-item light')
            .addClass(article.id === api.newsItem.getIdForArticle() ? 'active' : '')
            .append(
                $$('i').addClass(icon).attr('title', title)
            )
            .on('click', () => {

                if (!article.id || article.id.startsWith('__temp__')) {
                    api.ui.showDialog(
                        ShowVersionsComponent,
                        {
                            article: article,
                            applyVersion: this.props.applyVersion
                        },
                        {
                            title: this.getLabel('se.infomaker.history-header'),
                            global: true,
                            primary: this.getLabel('history-popover-Replace current article'),
                            secondary: this.getLabel('cancel'),
                            cssClass: 'np-teaser-dialog hide-overflow'
                        })
                } else {

                    api.router.getRemoteETag(article.id, 'x-im/article')
                        .then((etag) => {

                            let showConflictDialog = false

                            if (article.etag !== etag) {
                                if (article.id === api.newsItem.getIdForArticle() && api.router.getEtag(article.id) === etag) {
                                    // The article in question is what is loaded in the browser, and the Etag matches the one from server
                                    // Updated the etag for the article in history
                                    article.etag = etag
                                } else {
                                    showConflictDialog = true
                                }
                            }

                            if (showConflictDialog) {
                                api.ui.showDialog(
                                    ArticleEtagConflictComponent,
                                    {
                                        article: article
                                    },
                                    {
                                        title: this.getLabel('se.infomaker.history-conflict.title'),
                                        primary: this.getLabel('se.infomaker.history-button.reopen')
                                    }
                                )
                            } else {
                                api.ui.showDialog(
                                    ShowVersionsComponent,
                                    {
                                        article: article,
                                        applyVersion: this.props.applyVersion
                                    },
                                    {
                                        title: this.getLabel('se.infomaker.history-header'),
                                        global: true,
                                        primary: this.getLabel('history-popover-Replace current article'),
                                        secondary: this.getLabel('cancel'),
                                        cssClass: 'np-teaser-dialog hide-overflow'
                                    })
                            }
                        })
                }
            })

        const inner = $$('div').addClass('inner'),
            timeContainer = $$('span').addClass('time'),
            displayFormat = api.getConfigValue('se.infomaker.history', 'timeFormat')


        let time = moment(version.time).from()
        if (displayFormat) {
            time = moment(version.time).format(displayFormat)
        }

        timeContainer.append(time)

        const removeArticleBtn = $$('button').addClass('remove').append($$(FontAwesomeIcon, {icon: 'fa-times'}))
        removeArticleBtn.on('click', (e) => {
            e.stopPropagation()
            this.props.removeArticle(article)
        })

        const versionsContainer = $$('span').addClass('versions').append(`${article.versions.length} ${this.getLabel('history-popover-versions')}`)


        inner.append([removeArticleBtn, articleTitle, timeContainer, versionsContainer])

        outer.append(inner);
        return outer;
    }

}

export default HistoryItemComponent

import {Component, FontAwesomeIcon} from 'substance'
import {moment} from 'writer'

class HistoryItemComponent extends Component {

    render($$) {
        const article = this.props.article;
        const version = article.versions[0]

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
            if(dom.querySelector('idf').textContent) {
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
            .addClass(article.id === this.context.api.newsItem.getIdForArticle() ? 'active' : '')
            .append(
                $$('i').addClass(icon).attr('title', title)
            ).on('click', () => {
                this.props.applyVersion(version, article)
            });

        const inner = $$('div'),
            timeContainer = $$('span').addClass('time'),
            displayFormat = this.context.api.getConfigValue('se.infomaker.history', 'timeFormat')


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

        const versionsContainer = $$('span').addClass('versions').append(`${article.versions.length} ${this.getLabel('versions')}`)

        inner.append([removeArticleBtn, articleTitle, timeContainer, versionsContainer])

        outer.append(inner);
        return outer;
    }

}
export default HistoryItemComponent

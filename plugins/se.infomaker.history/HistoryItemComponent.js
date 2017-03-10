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

        if (headline.textContent.length > 2) {
            articleTitle = headline.textContent
        }
        const uuidRegex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
        const uuidMatches = uuidRegex.exec(article.id)
        if(uuidMatches && uuidMatches.length > 0) {
            icon = 'fa fa-cloud-upload'
            title = this.getLabel('history-popover-existing-article') + '- ID: ' + article.id
        } else {
            icon = 'fa fa-hdd-o'
            title = this.getLabel('history-popover-non-existing-article')
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
            moment(version.time).format(displayFormat)
        }

        timeContainer.append(time)

        const removeArticleBtn = $$('button').addClass('remove').append($$(FontAwesomeIcon, {icon: 'fa-times'}))
        removeArticleBtn.on('click', (e) => {
            e.stopPropagation()
            this.props.removeArticle(article)
        })



        inner.append([removeArticleBtn, articleTitle,timeContainer])

        outer.append(inner);
        return outer;
    }

}
export default HistoryItemComponent

import {Component, FontAwesomeIcon} from 'substance'

import HistoryItemComponent from './HistoryItemComponent'

class ArticleItem extends Component {

    render($$) {
        let el = $$('div').addClass('history-article')
        let article = this.props.article


        const deleteButton = $$('span').append($$(FontAwesomeIcon, {icon: 'fa-times'})
            .addClass('icon-delete')
            .attr('title', this.getLabel('Clear this version history')))
            .on('click', function () {
                this.context.api.history.deleteHistory(article.id);
                this.remove();
            }.bind(this));

        el.append(deleteButton)
        // let latestVersion = article.versions.reverse()[0];
        let title = article.id;

        let domParser = new DOMParser(),
            dom = domParser.parseFromString(article.versions[0].src, 'text/xml'),
            headline = dom.querySelector('idf element[type="headline"]')

        if (headline.textContent.length > 2) {
            title = headline.textContent
        }

        el.append(
            $$('h4').append([
                $$('i').addClass('fa fa-file-text-o'),
                title
            ])
        );

        let versions = article.versions.reverse().slice(0, 100).map(function (version) {
            return this.renderHistoryItem($$, version, article);
        }.bind(this));

        el.append(versions)
        return el
    }


    renderHistoryItem($$, version, article) {
        return $$(HistoryItemComponent, {
            version: version,
            article: article,
            applyVersion: this.props.applyVersion.bind(this)
        })
    }


}

export default ArticleItem

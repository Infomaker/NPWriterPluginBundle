import {Component, FontAwesomeIcon} from 'substance'

import HistoryItemComponent from './HistoryItemComponent'

class ArticleItem extends Component {

    render($$) {
        let el = $$('div').addClass('history-article')
        let article = this.props.article


        const deleteButton = $$('span').append($$(FontAwesomeIcon, {icon: 'fa-times'})
            .addClass('icon-delete')
            .attr('title', this.getLabel('Ignore and clear history')))
            .on('click', function () {
                this.context.api.history.deleteHistory(article.id);
                this.remove();
            }.bind(this));

        el.append(deleteButton)
        // let latestVersion = article.versions.reverse()[0];
        let title = article.id;

        el.append($$('h4').append(title));

        let versions = article.versions.slice(0, 100).map(function (version) {
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

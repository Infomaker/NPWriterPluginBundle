import {Component} from 'substance'
import {api} from 'writer'
import TimeLineComponent from './TimeLineComponent'
import ArticleDisplayComponent from './ArticleDisplayComponent'

class ShowVersionsComponent extends Component {

    getInitialState() {
        let historyForArticle = api.history.getHistoryForArticle(this.props.article.id);

        let hasVersions = (historyForArticle.versions && historyForArticle.versions.length > 0)

        return {
            history: historyForArticle,
            selectedArticle: hasVersions ? historyForArticle.versions[historyForArticle.versions.length - 1] : undefined
        }
    }

    render($$) {
        return $$('div')
            .addClass('showVersions')
            .append([
                $$('p').append(this.getLabel('se.infomaker.history-description')),
                $$(TimeLineComponent, {
                    markers: this.state.history.versions,
                    pointInTime: (article) => {
                        this.refs['displayComponent'].updateArticle(article)
                        this.extendState({selectedArticle: article})
                    }
                }).ref('timeLineComponent'),
                $$(ArticleDisplayComponent, {
                    articles: this.state.history.versions
                }).ref('displayComponent')
            ])
    }

    onClose(status) {
        if ('cancel' === status) {
            return true
        }

        else {
            this.props.applyVersion(this.state.selectedArticle, this.props.article)
        }

        return false
    }
}


export default ShowVersionsComponent
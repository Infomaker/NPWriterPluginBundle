import {Component} from 'substance'
import VersionSelectorDialog from './VersionSelectorDialog'
import HistoryItemComponent from './HistoryItemComponent'
import {event, api} from 'writer'


class HistoryMainComponent extends Component {

    constructor(...args) {
        super(...args)
        this.context.api.events.on('history', event.HISTORY_SAVED, () => {
            this.updateHistoryState()
        })

        this.context.api.events.on('history', event.HISTORY_SAVED, () => {
            this.updateHistoryState()
        })
    }

    dispose() {
        this.context.api.events.off('history', 'document:saved');
        this.context.api.events.off('history', 'history:added');
        this.context.api.events.off('history', 'history:saved');
    }


    updateHistoryState() {

        let id = this.context.api.newsItem.getIdForArticle()

        this.setState({
            historyForArticle: this.context.api.history.get(id)
        });
    }

    getInitialState() {
        let id = this.context.api.newsItem.getIdForArticle()

        return {
            historyForArticle: this.context.api.history.get(id)
        }
    }


    render($$) {

        var el = $$('div').addClass('imc-history light').append(
            $$('h2').append(this.getLabel('history-popover-headline'))
        )
        el.append($$('p').append(this.getLabel('history-popover-description')))

        if (this.state.historyForArticle === false) {
            return el
        }

        const scrollpane = api.ui.getComponent('scroll-pane')

        const scroll = $$(scrollpane, {
            scrollbarType: 'native'
        })


        let versions = this.state.historyForArticle.versions.reverse().slice(0, 100).map(function (version) {
            return this.renderHistoryItem($$, version, this.state.historyForArticle);
        }.bind(this));

        scroll.append(versions);
        el.append(scroll)

        var historyArticles = this.context.api.history.getHistory();
        var unsavedArticles = historyArticles.filter(function (history) {
            return history.unsavedArticle === true;
        });

        if (this.context.api.newsItem.hasTemporaryId()) {
            el.append(this.renderSeeAllUnsavedLink($$, unsavedArticles));
        }

        return el;
    }

    renderSeeAllUnsavedLink($$, unsavedArticles) {
        return $$('a').addClass('all-unsaved-articles').append(this.getLabel('See all other unsaved articles')).on('click', (_) => {
            this.context.api.ui.showDialog(
                VersionSelectorDialog,
                {
                    unsavedArticles: unsavedArticles,
                    descriptionText: this.getLabel('We\'ve found some unsaved articles. Click on the version you would like to restore')
                },
                {
                    global: true,
                    secondary: false,
                    title: this.getLabel("Following unsaved articles found")
                }
            );
        })
    }

    renderHistoryItem($$, version, article) {

        return $$(HistoryItemComponent, {
            version: version,
            article: article,
            applyVersion: this.applyVersion.bind(this)
        })
    }

    applyVersion(version, article) {

        this.context.api.writer.temporaryArticleID = article.id
        this.context.api.events.documentIsUnsaved()
        this.context.api.newsItem.setSource(version.src, null, true)

    }
}

export default HistoryMainComponent

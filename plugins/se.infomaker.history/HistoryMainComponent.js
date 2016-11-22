import {Component} from 'substance'
import VersionSelectorDialog from './VersionSelectorDialog'
import HistoryItemComponent from './HistoryItemComponent'
import {event, api} from 'writer'


class HistoryMainComponent extends Component {

    constructor(...args) {
        super(...args)

        api.events.on('history', event.DOCUMENT_SAVED, () => {
            api.history.deleteHistory(api.newsItem.getIdForArticle());
        })

        api.events.on('history', event.HISTORY_SAVED, () => {
            this.updateHistoryState()
        })
        api.events.on('history', event.HISTORY_ADDED, () => {
            this.updateHistoryState()
        })
    }

    dispose() {
        api.events.off('history', 'document:saved');
        api.events.off('history', 'history:added');
        api.events.off('history', 'history:saved');
    }


    didMount() {
        var historyArticles = api.history.getHistory();

        var unsavedArticles = historyArticles.filter(function (history) {
            return history.unsavedArticle === true;
        });

        let buttonText = 'No thanks, create a new article';
        let description = 'We\'ve found some unsaved articles. Click on the version you would like to restore';
        let title = "Unsaved articles found"

        // If we already have loaded an article from history we should not open the dialog again.
        let historyForArticle = api.history.get(api.newsItem.getIdForArticle());
        if (historyForArticle && historyForArticle.versions && historyForArticle.versions.length > 0 && api.newsItem.hasTemporaryId()) {
            return;
        } else if (!api.newsItem.hasTemporaryId() && historyForArticle.versions.length > 0) { // If we load a existing article
            unsavedArticles = [historyForArticle];
            buttonText = "Continue with last saved version";
            description = 'We found some unsaved changes for this article.';
            title = 'Unsaved changes found for this article';
        } else if (!api.newsItem.hasTemporaryId() && historyForArticle.versions.length === 0) {
            return;
        } else if (unsavedArticles.length === 0) {
            return;
        }

        if(api.document.getDocumentStatus() === 'writerHasNoDocument') {
            api.ui.showDialog(
                VersionSelectorDialog,
                {
                    unsavedArticles: unsavedArticles,
                    descriptionText: description,
                    applyVersion: this.applyVersion.bind(this)
                },
                {
                    global: true,
                    secondary: false,
                    primary: this.getLabel(buttonText),
                    title: this.getLabel(title)
                }
            )
        }

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
                    descriptionText: this.getLabel('We\'ve found some unsaved articles. Click on the version you would like to restore'),
                    applyVersion: this.applyVersion.bind(this)
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
        api.newsItem.setTemporaryId(article.id)
        api.events.documentIsUnsaved()
        api.newsItem.setSource(version.src, null, true)




    }
}

export default HistoryMainComponent

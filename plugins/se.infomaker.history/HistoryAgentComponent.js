import {Component} from 'substance'
import {event, api} from 'writer'

import VersionSelectorDialog from './VersionSelectorDialog'

class HistoryAgentComponent extends Component {

    constructor(...args) {
        super(...args)
        api.events.on('history_agent', event.DOCUMENT_SAVED, () => {
            api.history.deleteHistory(api.newsItem.getIdForArticle());
        })

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

        api.ui.showDialog(
            VersionSelectorDialog,
            {
                unsavedArticles: unsavedArticles,
                descriptionText: description
            },
            {
                global: true,
                secondary: false,
                primary: this.getLabel(buttonText),
                title: this.getLabel(title)
            }
        )
    }

    dispose() {
        super.dispose()
        api.events.off('history_agent', 'document:saved');
        api.events.off('history_agent', 'history:added');
        api.events.off('history_agent', 'history:saved');
    }

    render($$) {
        return $$('div').attr('id', 'history_agent').ref('history_agent');
    }
}

export default HistoryAgentComponent
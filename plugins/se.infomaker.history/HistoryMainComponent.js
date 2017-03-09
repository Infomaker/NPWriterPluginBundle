import {Component} from 'substance'
import HistoryItemComponent from './HistoryItemComponent'
import {event, api} from 'writer'
import RemoveAll from './RemoveAll'

class HistoryMainComponent extends Component {

    constructor(...args) {
        super(...args)

        api.events.on('history', event.DOCUMENT_SAVED, () => {
            api.history.deleteHistory(api.newsItem.getIdForArticle());
            this.updateHistoryState()
        })

        api.events.on('history', event.HISTORY_SAVED, () => {
            this.updateHistoryState()
        })
        api.events.on('history', event.HISTORY_CLEARED, () => {
            this.updateHistoryState()
        })
    }

    dispose() {
        api.events.off('history', 'document:saved');
        api.events.off('history', 'history:added');
        api.events.off('history', 'history:saved');
    }


    didMount() {
        // var historyArticles = api.history.getHistory();
        //
        // var unsavedArticles = historyArticles.filter(function (history) {
        //     return history.unsavedArticle === true;
        // })
        //
        // // If we already have loaded an article from history we should not open the dialog again.
        // let historyForArticle = api.history.get(api.newsItem.getIdForArticle());
        //
        // if (historyForArticle && historyForArticle.versions && historyForArticle.versions.length > 0 && api.newsItem.hasTemporaryId()) {
        //     return
        // }
        // else if (!api.newsItem.hasTemporaryId() && historyForArticle.versions.length === 0) {
        //     return
        // }
        // else if (unsavedArticles.length === 0) {
        //     return
        // }
        //
        //
        // let title = this.getLabel('Unsaved articles found')
        // let description = this.getLabel('It looks like there are one or more unsaved articles. Do you want to restore an unsaved article?')
        // let primaryButton = this.getLabel('No thanks, create new article')
        // let secondaryButton = this.getLabel('Restore latest unsaved article')
        // let existingArticle = false
        //
        // if (!api.newsItem.hasTemporaryId() && historyForArticle.versions.length > 0) { // If we load a existing article
        //     unsavedArticles = [historyForArticle];
        //     existingArticle = true
        //
        //     title = this.getLabel('Unsaved changes found for this article')
        //     description = this.getLabel('We found some unsaved changes for this article. Do you want to restore the unsaved changes?')
        //     primaryButton = this.getLabel('Restore unsaved changes')
        //     secondaryButton = this.getLabel('No thanks, just open the article')
        // }
        //
        // if(api.document.getDocumentStatus() === 'writerHasNoDocument') {
        //     api.ui.showDialog(
        //         VersionSelectorDialog,
        //         {
        //             existingArticle: existingArticle,
        //             unsavedArticles: unsavedArticles,
        //             descriptionText: description,
        //             applyVersion: this.applyVersion.bind(this)
        //         },
        //         {
        //             global: true,
        //             title: title,
        //             primary: primaryButton,
        //             secondary: secondaryButton
        //         }
        //     )
        // }

    }


    updateHistoryState() {

        let id = this.context.api.newsItem.getIdForArticle()

        this.setState({
            historyForArticle: this.context.api.history.get(id),
            historyArticles: this.context.api.history.getHistory()
        });
    }

    getInitialState() {
        let id = this.context.api.newsItem.getIdForArticle()

        return {
            historyForArticle: this.context.api.history.get(id),
            historyArticles: this.context.api.history.getHistory()
        }
    }


    render($$) {

        const el = $$('div').addClass('imc-history light').append(
            $$('h2').append(this.getLabel('history-popover-headline'))
        )
        el.append($$('p').append(this.getLabel('history-popover-description')))
        if(this.state.historyArticles.length === 0) {
            el.append($$('p').append(this.getLabel('history-popover-no-items-description')))
        }
        if (this.state.historyForArticle === false) {
            return el
        }

        const scrollpane = api.ui.getComponent('scroll-pane')
        const scroll = $$(scrollpane, {
            scrollbarType: 'native'
        })


        let versions = this.state.historyArticles.map(function (article) {
            return this.renderHistoryItem($$, article);
        }.bind(this));

        scroll.append(versions)
        if(this.state.historyArticles.length > 0) {
            scroll.append($$(RemoveAll, {removeAll: this.removeAll.bind(this)}))
        }

        el.append(scroll)



        return el;
    }


    renderHistoryItem($$, article) {
        return $$(HistoryItemComponent, {
            article: article,
            applyVersion: this.applyVersion.bind(this),
            removeArticle: this.removeArticle.bind(this)
        })
    }

    removeAll() {
        api.history.deleteAll()
    }

    removeArticle(article) {
        api.history.deleteHistory(article.id)
    }
    applyVersion(version, article) {
        // this function can fire onclick handler for any DOM-Element
        function fireClickEvent(element) {
            let evt = new window.MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });

            element.dispatchEvent(evt);
        }

        const uuidRegex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
        const uuidMatches = uuidRegex.exec(article.id)
        if(uuidMatches && uuidMatches.length > 0) {
            // Is existing article, open in new tab
            const writerUrl = api.router.getEndpoint() + "/#" + uuidMatches[0]
            const a = document.createElement('a');
            a.href = writerUrl;
            a.target = '_blank'
            fireClickEvent(a);
        } else {
            // Is temp article, replace in window
            api.newsItem.setTemporaryId(article.id)
            api.browser.ignoreNextHashChange = true
            api.browser.setHash('')
            api.newsItem.setSource(version.src, null, article.etag)
            //
            api.events.documentChanged(
                'se.infomaker.history',
                {
                    type: 'version',
                    action: 'update'
                }
            )
        }


    }
}

export default HistoryMainComponent

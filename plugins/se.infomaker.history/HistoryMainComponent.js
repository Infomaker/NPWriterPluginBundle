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

    updateHistoryState() {
        this.extendState({
            historyArticles: this.context.api.history.getHistory()
        });
    }

    getInitialState() {
        return {
            historyArticles: this.context.api.history.getHistory()
        }
    }

    render($$) {

        const el = $$('div').ref('historyContainer').addClass('imc-history light').append(
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
        }).ref('historyScroll')

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
        }).ref(article.id)
    }

    removeAll() {
        api.history.deleteAll()
    }

    removeArticle(article) {
        api.history.deleteHistory(article.id)
    }

    applyVersion(version, article) {

        // this function can fire onclick handler for any DOM-Element
        if(article.id.indexOf('__temp__') === -1) {
            api.newsItem.setTemporaryId(article.id)
            api.browser.ignoreNextHashChange = true
            api.browser.setHash(article.id)
            api.newsItem.setSource(version.src, null, article.etag)

            api.events.documentChanged(
                'se.infomaker.history',
                {
                    type: 'version',
                    action: 'update'
                }
            )

        } else {
            // Is temp article, replace in window
            api.newsItem.setTemporaryId(article.id)
            api.browser.ignoreNextHashChange = true
            api.browser.setHash('')
            api.newsItem.setSource(version.src, null, article.etag)

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

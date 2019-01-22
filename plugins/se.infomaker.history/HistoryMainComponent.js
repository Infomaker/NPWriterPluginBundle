import {Component, ScrollPane} from 'substance'
import HistoryItemComponent from './HistoryItemComponent'
import {api, event} from 'writer'
import RemoveAll from './RemoveAll'

const DEFAULT_MAX_DAYS = 7

class HistoryMainComponent extends Component {

    constructor(...args) {
        super(...args)

        api.events.on('history', event.DOCUMENT_SAVED, () => {
            api.history.snapshot();
            api.history.cleanVersionsOlderThanMaxDays(DEFAULT_MAX_DAYS);
            this.updateHistoryState()
        })

        api.events.on('history', event.HISTORY_SAVED, () => {
            this.updateHistoryState()
        })
        api.events.on('history', event.HISTORY_CLEARED, () => {
            this.updateHistoryState()
        })

        this.historyArticles = this.context.api.history.getHistory()
    }

    dispose() {
        api.events.off('history', 'document:saved');
        api.events.off('history', 'history:added');
        api.events.off('history', 'history:saved');
    }

    updateHistoryState() {
        this.historyArticles = this.context.api.history.getHistory()
    }

    render($$) {

        const el = $$('div').ref('historyContainer').addClass('imc-history light').append(
            $$('h2').append(this.getLabel('history-popover-headline'))
        )
        el.append($$('p').append(this.getLabel('history-popover-description')))
        if (this.historyArticles.length === 0) {
            el.append($$('p').append(this.getLabel('history-popover-no-items-description')))
        }
        if (this.historyForArticle === false) {
            return el
        }

        const scroll = $$(ScrollPane, {
            scrollbarType: 'native'
        }).ref('historyScroll')

        let versions = this.historyArticles.map(function (article) {
            return this.renderHistoryItem($$, article);
        }.bind(this));

        scroll.append(versions)
        if (this.historyArticles.length > 0) {
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
        this.rerender()
    }

    removeArticle(article) {
        api.history.deleteHistory(article.id)
        this.rerender()
    }

    applyVersion(version, article) {

        // this function can fire onclick handler for any DOM-Element
        if (article.id.indexOf('__temp__') === -1) {
            api.newsItem.setTemporaryId(article.id)
            api.browser.ignoreNextHashChange = true
            api.browser.setHash(article.id)
            api.newsItem.setSource(version.src, null, article.etag)

            api.events.trigger(
                'se.infomaker.history',
                event.DOCUMENT_CHANGED,
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

            api.events.trigger(
                'se.infomaker.history',
                event.DOCUMENT_CHANGED,
                {
                    type: 'version',
                    action: 'update'
                }
            )
        }
    }
}

export default HistoryMainComponent

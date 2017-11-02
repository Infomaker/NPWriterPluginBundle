const {Component} = substance
const {api, moment, event} = writer
import './scss/index.scss'

class TextanalyzerComponent extends Component {

    dispose() {
        api.events.off('textanalyzer', event.DOCUMENT_CHANGED);
    }

    constructor(...args) {
        super(...args)

        api.events.on('textanalyzer', event.DOCUMENT_CHANGED, () => {
            this.calculateText()
        })
    }

    calculateText() {
        let count = this.getCount()
        this.setState({
            textLength: count.textLength,
            words: count.words
        })
    }

    render($$) {
        let el = $$('div').addClass('textanalyzer plugin')
        let innerEl = $$('div').addClass('info__container clearfix')

        // Status
        // TODO: later...

        // Source
        const source = this._getSource()
        if (source) {
            const sourceLabel = this.getLabel('Source') + ':'
            this._createAndAppendRowElement($$, innerEl, sourceLabel, sourceLabel, source)
        }

        // Created
        const createdLabel = this.getLabel('Created') + ':'
        this._createAndAppendRowElement($$, innerEl, createdLabel, createdLabel, this._getCreatedDate())

        // Updated
        const updatedLabel = this.getLabel('Updated') + ':'
        this._createAndAppendRowElement($$, innerEl, updatedLabel, updatedLabel, this._getUpdatedDate())

        innerEl.append($$('hr'))

        // Nr of words
        const wordsLabel = this.getLabel('Words') + ':'
        this._createAndAppendRowElement($$, innerEl, 'Words', wordsLabel, this.state.words.toString())

        // Nr of characters
        const charLabel = this.getLabel('Characters') + ':'
        this._createAndAppendRowElement($$, innerEl, 'Character count', charLabel, this.state.textLength.toString())

        el.append(innerEl)
        return el
    }

    _createAndAppendRowElement($$, parent, title, label, value) {
        let infoBoxEl = $$('div').addClass('info-box').attr('title', title)
        let labelEl = $$('div').addClass('label').append(label)
        let infoEl = $$('div').addClass('info')
        let valueEl = $$('strong').append(value)

        infoEl.append(valueEl)
        infoBoxEl.append(labelEl).append(infoEl)
        parent.append(infoBoxEl)
    }

    /**
     * Get source from newsItem > contentMeta > links > link[@type='x-im/articlesource']/@title.
     *
     * @returns {*}
     * @private
     */
    _getSource() {
        const links = api.newsItem.getContentMetaLinkByType(
            'textanalyzer',
            'x-im/articlesource'
        )

        // There can be only one
        if (links && links.length === 1) {
            return links[0]['@title']
        }
        else if (links && links.length > 1) {
            console.error('This article has multiple sources. Should only be one')
        }

        return null
    }

    _getCreatedDate() {
        return this._getSafeDate(api.newsItem.getFirstCreated())
    }

    _getUpdatedDate() {
        return this._getSafeDate(api.newsItem.getVersionCreated())
    }

    _getSafeDate(date) {
        if (date && !this.isTemplate) {
            return moment(date).format('YYYY-MM-DD HH:mm')
        }
        else {
            return '-'
        }
    }

    getInitialState() {
        // Is this a new article? Used when rendering create/update dates
        this.isTemplate = !api.newsItem.getGuid()

        const count = this.getCount()
        return {
            textLength: count.textLength,
            words: count.words
        }
    }

    getCount() {
        const nodes = api.document.getDocumentNodes()
        let textContent = "";
        nodes.forEach(function (node) {
            if (node.content) {
                textContent += node.content.trim()
            }
        })

        const words = textContent.split(/\s+/)
        const textLength = textContent.length
        return {
            words: words.length,
            textLength: textLength
        }
    }

}

export default TextanalyzerComponent

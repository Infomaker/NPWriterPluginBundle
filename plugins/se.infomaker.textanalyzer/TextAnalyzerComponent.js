const {Component} = substance
const {api, moment, event} = writer
import './scss/index.scss'

class TextanalyzerComponent extends Component {

    dispose() {
        api.events.off('textanalyzer', event.DOCUMENT_CHANGED);
        api.events.off('textanalyzer', event.DOCUMENT_SAVED);
    }

    constructor(...args) {
        super(...args)

        api.events.on('textanalyzer', event.DOCUMENT_CHANGED, () => {
            this.calculateText()
        })

        api.events.on('textanalyzer', event.DOCUMENT_SAVED, () => {
            this.extendState({
                updatedDate: this._getSafeDate(new Date())
            })
        })
    }

    calculateText() {
        let count = this.getStatistics()
        this.extendState({
            textLength: count.textLength,
            words: count.words,
            lix: count.lix
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
            const sourceLabel = this.getLabel('Source')
            this._createAndAppendRowElement($$, innerEl, sourceLabel, sourceLabel, source)
        }

        // Created
        const createdLabel = this.getLabel('Created')
        this._createAndAppendRowElement($$, innerEl, createdLabel, createdLabel, this.state.createdDate.toString())

        // Updated
        const updatedLabel = this.getLabel('Updated')
        this._createAndAppendRowElement($$, innerEl, updatedLabel, updatedLabel, this.state.updatedDate.toString())

        innerEl.append($$('hr'))

        // Nr of words
        const wordsLabel = this.getLabel('Words')
        this._createAndAppendRowElement($$, innerEl, 'Words', wordsLabel, this.state.words.toString())

        // Nr of characters
        const charLabel = this.getLabel('Characters')
        this._createAndAppendRowElement($$, innerEl, 'Character count', charLabel, this.state.textLength.toString())

        this._createAndAppendRowElement(
            $$,
            innerEl,
            this.getLabel('Readability'),
            this.getLabel('Readability'),
            this._getLixDescription(this.state.lix)
        )

        el.append(innerEl)
        return el
    }

    _getLixDescription(lix) {
        if (lix <= 30) {
            return this.getLabel('Simple text, for children')
        }
        else if (lix <= 40) {
            return this.getLabel('Easy to read literature')
        }
        else if (lix <= 50) {
            return this.getLabel('Normal text')
        }
        else if (lix <= 60) {
            return this.getLabel('Contains difficult language')
        }
        else {
            return this.getLabel('Very difficult language')
        }
    }
    _createAndAppendRowElement($$, parent, title, label, value) {
        let infoBoxEl = $$('div').addClass('info-box').attr('title', title)
        let labelEl = $$('div').addClass('label').append(label + ':')
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

        const count = this.getStatistics()
        return {
            textLength: count.textLength,
            words: count.words,
            lix: count.lix,
            createdDate: this._getCreatedDate(),
            updatedDate: this._getUpdatedDate()
        }
    }

    getStatistics() {
        const nodes = api.document.nodes()
        let textContent = '';
        nodes.forEach(function (node) {
            if (node.content) {
                textContent += node.content.trim()
            }
        })

        return this.calculateStatistics(textContent)
    }

    calculateStatistics(text) {
        const sentences = text.split(/[.!?]/)
        const noOfSentences = sentences.length
        let noOfWords = 0
        let noOfLongWords = 0
        // let totalWordLength = 0

        sentences.forEach(s => {
            const words = s.replace(/[ \\:;\n\r\t.,'\"\`<>()=+!?¿-]+/g, ' ').trim().split(' ')
            noOfWords += words.length

            words.forEach(w => {
                // totalWordLength += w.length
                if (w.length > 6) {
                    noOfLongWords++
                }
            })
        })

        // console.log('Average: ' + totalWordLength / noOfWords)
        const avgSentenceLength = noOfWords / noOfSentences
        const longWordRatio = noOfLongWords / noOfWords * 100
        const lix = avgSentenceLength + longWordRatio

        return {
            lix: Math.ceil(lix),
            words: noOfWords,
            textLength: text.length
        }
    }
}

export default TextanalyzerComponent

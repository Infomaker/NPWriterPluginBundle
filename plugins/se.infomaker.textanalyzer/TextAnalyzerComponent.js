const {Component} = substance
const {api} = writer

class TextanalyzerComponent extends Component {

    dispose() {
        api.events.off('textanalyzer', 'document:changed');
    }

    constructor(...args) {
        super(...args)
        api.events.on('textanalyzer', 'document:changed', () => {
            this.calculateText()
        })
    }

    calculateText() {
        var count = this.getCount()
        this.setState({
            textLength: count.textLength,
            words: count.words
        })
    }

    render($$) {
        var el = $$('div').addClass('sc-information-panel plugin')
            .append($$('h2').append('Text'))

        var numberContainer = $$('div').addClass('number__container clearfix')

        var textlengthEl = $$('div').addClass('count-info')
            .append($$('span').append(this.state.textLength.toString()))
            .append($$('p').append('Tecken'))
            .attr('title', "Tecken")

        var wordsEl = $$('div').addClass('count-info')
            .append($$('span').append(this.state.words.toString()))
            .append($$('p').append('Ord'))
            .attr('title', "Ord")

        numberContainer.append([
            textlengthEl,
            wordsEl
        ])
        el.append(numberContainer)

        return el
    }

    getInitialState() {
        var count = this.getCount()
        return {
            textLength: count.textLength,
            words: count.words
        }
    }

    getCount() {
        var nodes = api.document.getDocumentNodes()
        var textContent = "";
        nodes.forEach(function (node) {
            if (node.content) {
                textContent += node.content.trim()
            }
        })
        var words = textContent.split(/\s+/)
        var textLength = textContent.length

        return {
            words: words.length,
            textLength: textLength
        }
    }

}
export default TextanalyzerComponent
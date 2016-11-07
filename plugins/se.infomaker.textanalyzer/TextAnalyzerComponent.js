const {Component} = substance
const {api, event} = writer
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
        var count = this.getCount()
        this.setState({
            textLength: count.textLength,
            words: count.words
        })
    }

    didMount() {
        // this.props.popover.setIcon('fa-line-chart')
    }

    render($$) {
        var el = $$('div').addClass('textanalyzer plugin')

        var numberContainer = $$('div').addClass('number__container clearfix')

        var textlengthEl = $$('div').addClass('count-info')
            .append($$('span').append(this.state.textLength.toString()))
            .append($$('p').append(this.getLabel('Characters')))
            .attr('title', this.getLabel('Characters'))

        var wordsEl = $$('div').addClass('count-info')
            .append($$('span').append(this.state.words.toString()))
            .append($$('p').append(this.getLabel('Words')))
            .attr('title', this.getLabel('Words'))

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
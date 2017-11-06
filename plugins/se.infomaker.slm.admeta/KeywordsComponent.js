import { Component } from 'substance'
import { api } from 'writer'
import KeywordItemComponent from './KeywordItemComponent'
import InputSelectionComponent from './InputSelectionComponent'

class KeywordsComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'admeta'
    }

    render($$) {
        const el = $$('div').addClass('keywords')

        const keywordsTitle = $$('h2').append(this.getLabel('admeta-keywords'))

        const keywordList = $$('ul').addClass('tag-list')

        const keywordItems = this.props.keywords.map(keyword => {
            return $$(KeywordItemComponent, {
                keyword,
                removeKeyword: this.props.removeKeyword.bind(this)
            }).ref('keyword-' + keyword)
        })
        keywordList.append(keywordItems)

        const keywordInput = this._renderKeywordInput($$)

        const keywordSelection = $$(InputSelectionComponent, {
            inputValue: this.state.inputValue,
            onSelect: this.addKeywords.bind(this)
        })

        el.append([keywordsTitle, keywordList, keywordInput, keywordSelection])
        return el
    }

    _renderKeywordInput($$) {
        return $$('div').addClass('search__container').append(
            $$('div').addClass('form-group').append(
                $$('input').addClass('form-control form__search')
                .ref('keywordInput')
                .attr('placeholder', api.getLabel('admeta-add-keywords'))
                .on('keydown', this.handleKeywordInput.bind(this))
                .on('input', this.updateInputSelection.bind(this))
            )
        )
    }

    handleKeywordInput(e) {
        if (e.keyCode === 13) {
            this.addKeywords()
        }
    }

    addKeywords() {
        const keywordInputElem = this.refs.keywordInput
        this.props.addKeywords(keywordInputElem.val().split(','))
        this.extendState({ inputValue: '' })
        keywordInputElem.val('')
    }

    updateInputSelection() {
        const keywordInputElem = this.refs.keywordInput
        this.extendState({ inputValue: keywordInputElem.val() })
    }
}

export default KeywordsComponent

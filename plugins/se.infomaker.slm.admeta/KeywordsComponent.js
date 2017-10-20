import { Component } from 'substance'
import { api } from 'writer'
import KeywordItemComponent from './KeywordItemComponent'


class KeywordsComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'admeta'
    }

    render($$) {
        const el = $$('div').addClass(this.name)

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

        el.append([keywordsTitle, keywordList, keywordInput])
        return el
    }

    _renderKeywordInput($$) {
        return $$('div').addClass('search__container').append(
            $$('div').addClass('form-group').append(
                $$('input').addClass('form-control form__search')
                .ref('keywordInput')
                .attr('placeholder', api.getLabel('admeta-add-keywords'))
                .on('keydown', this.handleKeywordInput)
            )
        )
    }

    handleKeywordInput(e) {
        if (e.keyCode === 13) {
            const keywords = e.srcElement.value.split(',')
            this.props.addKeywords(keywords)
            e.srcElement.value = ''
        }
    }
}

export default KeywordsComponent

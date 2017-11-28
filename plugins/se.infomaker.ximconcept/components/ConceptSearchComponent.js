import { Component } from 'substance'
import { ConceptService } from 'writer'
import ConceptSearchResultComponent from './ConceptSearchResultComponent'

class ConceptSearchComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    getInitialState() {
        return {
            selected: 0,
        }
    }

    resetState() {
        this.extendState({
            searching: false,
            searchResult: null,
            searchedTerm: false,
            selected: 0,
        })
    }

    render($$){
        let spinner = ''
        const { searchedTerm } = this.state
        const disabled = this.props.disabled
        const searchInput = $$('input', {
            type: 'text',
            name: 'concept-search',
            class: 'concept-search-input form-control',
            placeholder: this.props.placeholderText,
            autocomplete: 'off',
        })
        .on('keydown', this.handleKeyDown)
        .on('keyup', this.handleKeyUp)
        .on('blur', this.handleBlur)
        .on('focus', this.handleFocus)
        .ref('searchInput')

        if (disabled) {
            searchInput.attr('disabled', true)
        }

        if (this.state.searching) {
            spinner = $$('i', {
                class: 'fa fa-spinner fa-spin concept-search-spinner',
                "aria-hidden": 'true'
            })
        }

        const el = $$('div')
            .addClass('concept-search-component')
            .append(searchInput)
            .append(spinner)

        if (searchedTerm) {
            let { searchResult } = this.state
            
            if (this.shouldShowCreate()) {
                searchResult = [...searchResult, {
                    ConceptName: `${this.getLabel('create')}: ${searchedTerm}`,
                }]
            }

            const searchResults = $$(ConceptSearchResultComponent, {
                searchResult: searchResult,
                selected: this.state.selected,
                itemExists: this.props.itemExists
            }).ref('searchResultComponent')
            el.append(searchResults)
        }

        return el
    }

    shouldShowCreate() {
        return (
            this.props.editable &&
            this.state.searchedTerm !== '*'
        )
    }

    handleFocus() {

    }

    handleBlur() {
        this.refs.searchInput.val('')
        this.resetState()
    }

    handleKeyUp() {
        const term = this.refs.searchInput.val().trim()
        
        if (term !== this.state.searchedTerm && (term.length > 2 || term === '*')) {
            if (!this.state.searching) {
                this.extendState({
                    searching: true
                })

                this.search(term)
            }
        } else if (!term || !term.length) {
            this.resetState()
        }
    }

    async search(term) {
        this.extendState({
            searching: false,
            searchResult: await ConceptService.searchForConceptSuggestions(this.props.conceptTypes, term, this.props.entities),
            selected: 0,
            searchedTerm: term,
        })
    }

    handleKeyDown(e) {
        const {keyCode} = e
        let atTheEnd, newItem
        switch (keyCode) {
            case 27: // escape
                e.preventDefault()
                this.refs.searchInput.val('')
                this.resetState()
                break
            case 38: // arrow up
                e.preventDefault()
                this.extendState({
                    selected: (this.state.selected > 0) ? this.state.selected - 1 : 0
                })
                break
            case 9:
            case 40: // arrow down
                e.preventDefault()
                atTheEnd = this.shouldShowCreate() ? (this.state.selected === this.state.searchResult.length) : (this.state.selected === this.state.searchResult.length - 1)
                if (!atTheEnd) {
                    this.extendState({
                        selected: this.state.selected + 1
                    })
                }
                break
            case 13: // enter
                e.preventDefault()
                newItem = this.getItemToAdd()
                this.props.addItem(newItem)
                this.refs.searchInput.val('')
                this.resetState()
                break
            default:
                break
        }
    }

    getItemToAdd() {
        return this.state.searchResult[this.state.selected] || {
            ConceptName: this.state.searchedTerm,
            ConceptImTypeFull: this.props.conceptTypes //TODO: This wont work when we have multiple types
        }
    }

}

export default ConceptSearchComponent

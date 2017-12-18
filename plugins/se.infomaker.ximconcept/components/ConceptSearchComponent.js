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
        this.refs.searchInput.val('')
        this.extendState({
            searching: false,
            searchResult: null,
            searchedTerm: false,
            selected: 0,
        })
    }

    render($$){
        let icon, searchResultsContainer
        const { searchedTerm } = this.state
        const { disabled, subtypes } = this.props
        const isPolygon = (subtypes && subtypes.length === 1 && subtypes[0] === 'polygon')
        const searchInput = $$('input', {
            type: 'text',
            name: 'concept-search',
            class: `concept-search-input ${this.state.searchResult && this.state.searchResult.length ? 'results' : '   '}`,
            placeholder: this.props.placeholderText,
            autocomplete: 'off',
        })
        .on('keydown', this.handleKeyDown)
        .on('keyup', this.handleKeyUp)
        .on('blur', this.handleBlur)
        .ref('searchInput')

        if (disabled) {
            searchInput.attr('disabled', true)
        } else {
            if (this.state.searching) {
                icon = $$('i', {
                    class: 'fa fa-spinner fa-spin concept-search-icon searching',
                    "aria-hidden": 'true'
                })
            } else if (searchedTerm) {
                icon = $$('i', {
                    class: 'fa fa-times concept-search-icon abort',
                    "aria-hidden": 'true'
                }).on('click', this.resetState.bind(this))
            } else {
                icon = $$('i', {
                    class: 'fa fa-search concept-search-icon search',
                    "aria-hidden": 'true'
                })
            }
        }

        if (searchedTerm) {
            let { searchResult, selected } = this.state

            searchResultsContainer = $$(ConceptSearchResultComponent, {
                searchedTerm,
                searchResult,
                selected,
                isPolygon,
                editable: this.props.editable,
                itemExists: this.props.itemExists,
                addItem: this.addItem.bind(this)
            }).ref('searchResultComponent')
        }

        const el = $$('div')
            .addClass('concept-search-component')
            .append(searchInput)
            .append(icon)
            .append(searchResultsContainer)

        return el
    }

    handleBlur() {
        this.refs.searchInput.val('')
        this.resetState()
    }

    handleKeyUp() {
        const term = this.refs.searchInput.val().trim()
        
        if (term !== this.state.searchedTerm && (term.length > 1 || term === '*')) {
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
            searchResult: await ConceptService.searchForConceptSuggestions(this.props.conceptTypes, term, this.props.subtypes),
            selected: 0,
            searchedTerm: term,
        })
    }

    addItem(item) {
        item = (item && item.ConceptReplacedByRelation) ? item.ConceptReplacedByRelation : 
            (item && !item.target) ? item : { searchedTerm: this.state.searchedTerm, create: true }

        this.props.addItem(item)
    }

    handleKeyDown(e) {
        const {keyCode} = e
        let selectedItem

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
            case 9: // tab
            case 40: // arrow down
                e.preventDefault()
                this.extendState({
                    selected: (this.state.selected === this.state.searchResult.length - 1) ? this.state.selected : this.state.selected + 1
                })
                break
            case 13: // enter
                selectedItem = this.state.searchResult[this.state.selected]
                if (selectedItem || this.props.editable) {
                    this.addItem(selectedItem)
                    this.refs.searchInput.val('')
                    this.resetState()
                }

                break
            default:
                break
        }
    }

}

export default ConceptSearchComponent

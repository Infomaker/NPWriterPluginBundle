import { Component } from 'substance'
import { ConceptService } from 'writer'
import ConceptSearchResultComponent from './ConceptSearchResultComponent'

class ConceptSearchComponent extends Component {

    constructor(...args) {
        super(...args)

        this.handleInput = this.handleInput.bind(this)
    }

    getInitialState() {
        return {
            selected: 0,
        }
    }

    resetState() {
        this.refs.searchInput.val('')
        this.extendState({
            searching: 0,
            searchResult: null,
            searchedTerm: false,
            selected: 0,
        })
    }

    render($$) {
        let icon, searchResultsContainer
        const el = $$('div')
        const { searchedTerm } = this.state
        const { disabled, subtypes, enableHierarchy, propertyMap } = this.props
        const isPolygon = (subtypes && subtypes.length === 1 && subtypes[0] === 'polygon')
        const searchInput = $$('input', {
            type: 'text',
            name: 'concept-search',
            class: `concept-search-input ${this.state.searchResult && this.state.searchResult.length ? 'results' : '   '}`,
            placeholder: this.props.placeholderText,
            autocomplete: 'off'
        })
            .on('input', this.debounce(400, this.handleInput))
            .on('keydown', this.handleKeyDown)
            .on('focus', this.handleFocus)
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
            let { searchResult, selected, searching } = this.state

            searchResultsContainer = $$(ConceptSearchResultComponent, {
                searchedTerm,
                searching,
                searchResult,
                selected,
                isPolygon,
                enableHierarchy,
                propertyMap,
                editable: this.props.editable,
                itemExists: this.props.itemExists,
                addItem: this.addItem.bind(this)
            }).ref('searchResultComponent')
        }


        el.addClass('concept-search-component')
            .append(searchInput)
            .append(icon)
            .append(searchResultsContainer)

        return el
    }

    debounce(delay, fn) {
        let timerId;
        return function (...args) {
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                fn(...args);
                timerId = null;
            }, delay);
        }
    }

    handleInput() {
        const term = this.refs.searchInput.val().trim()

        if (term !== this.state.searchedTerm && (term.length > 1 || term === '*')) {
            this.extendState({
                searching: this.state.searching + 1
            })

            this.search(term)
        } else if (!this.state.selected && (!term || !term.length)) {
            this.resetState()
        }
    }

    handleFocus() {
        this.resetState()
        this.extendState({
            searching: this.state.searching + 1,
            hasFocus: true
        })

        this.search('*')
    }

    handleBlur() {
        this.refs.searchInput.val('')
        this.resetState()
        this.extendState({ hasFocus: false })
    }

    async search(term) {
        const result = await ConceptService.searchForConceptSuggestions(
            this.props.conceptTypes,
            term,
            this.props.subtypes
        )

        if (this.state.hasFocus) {
            this.extendState({
                searching: this.state.searching > 0 ? this.state.searching - 1: 0,
                searchResult: result,
                selected: 0,
                searchedTerm: term,
            })
        } else {
            this.resetState()
        }
    }

    addItem(item) {
        const { propertyMap } = this.props
        item = (item && item[propertyMap.ConceptReplacedByRelation]) ? item[propertyMap.ConceptReplacedByRelation] :
            (item && !item.target) ? item : { searchedTerm: this.state.searchedTerm, create: true }

        this.props.addItem(item)
    }

    handleKeyDown(e) {
        const { keyCode } = e
        let selectedItem

        switch (keyCode) {
            case 27: // escape
                e.preventDefault()
                e.stopPropagation()

                this.refs.searchInput.val('')
                this.resetState()

                break
            case 38: // arrow up
                e.preventDefault()
                e.stopPropagation()

                this.extendState({
                    selected: (this.state.selected > 0) ? this.state.selected - 1 : 0
                })

                break
            case 9: // tab
            case 40: // arrow down
                e.preventDefault()
                e.stopPropagation()

                if (this.state.searchResult) {
                    this.extendState({
                        selected: (this.state.selected === this.state.searchResult.length - 1) ? this.state.selected : this.state.selected + 1
                    })
                }

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

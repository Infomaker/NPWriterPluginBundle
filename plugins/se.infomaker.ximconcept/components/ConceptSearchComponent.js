import { Component } from 'substance'
import { ConceptService, api } from 'writer'
import ConceptSearchResultComponent from './ConceptSearchResultComponent'

class ConceptSearchComponent extends Component {

    constructor(...args) {
        super(...args)

        this.handleInput = this.handleInput.bind(this)
        this.addItem = this.addItem.bind(this)
    }

    getInitialState() {
        return {
            selected: 0,
            seq: 0
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

        let searchFormIcon, searchResultsContainer

        const el = $$('div')
        const { searchedTerm, searchResult, searching } = this.state
        const { disabled, enableHierarchy, propertyMap, icon, types, placeholderText } = this.props

        const searchInput = $$('input', {
            type: 'text',
            name: 'concept-search',
            class: `concept-search-input ${searchResult && searchResult.length ? 'results' : '   '}`,
            placeholder: placeholderText,
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
            if (searching) {
                searchFormIcon = $$('i', {
                    class: 'fa fa-spinner fa-spin concept-search-icon searching',
                    "aria-hidden": 'true'
                })
            } else if (searchedTerm) {
                searchFormIcon = $$('i', {
                    class: 'fa fa-times concept-search-icon abort',
                    "aria-hidden": 'true'
                }).on('click', this.resetState.bind(this))
            } else {
                searchFormIcon = $$('i', {
                    class: 'fa fa-search concept-search-icon search',
                    "aria-hidden": 'true'
                })
            }
        }

        const searchForm = $$('form', { autocomplete: 'user-password' })
            .append(searchInput)
            .append(searchFormIcon)

        if (searchedTerm) {
            let { selected } = this.state

            searchResultsContainer = $$(ConceptSearchResultComponent, {
                searchedTerm,
                searching,
                searchResult,
                selected,
                icon,
                types,
                isPolygon: this.isPolygon,
                enableHierarchy,
                propertyMap,
                creatable: this.props.creatable,
                itemExists: this.props.itemExists,
                addItem: this.addItem
            }).ref('searchResultComponent')
        }


        el.addClass('concept-search-component')
            .append(searchForm)
            // .append(searchFormIcon)
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
                searching: this.state.searching + 1,
                seq: this.state.seq + 1
            })

            this.search(term, this.state.seq)
        } else if (!this.state.selected && (!term || !term.length)) {
            this.resetState()
        }
    }

    handleFocus() {
        this.resetState()
        this.extendState({
            searching: this.state.searching + 1,
            hasFocus: true,
            seq: this.state.seq + 1
        })

        // Search on focus, unless searchOnFocus is defined and set to false.
        const data = this.parent.props.pluginConfigObject.pluginConfigObject.data
        if (!data || data.hasOwnProperty('searchOnFocus') === false || data.searchOnFocus !== false) {
            this.search('*')
        }
    }

    handleBlur() {
        this.refs.searchInput.val('')
        this.resetState()
        this.extendState({ hasFocus: false })
    }

    async search(term, inSeq) {
        const result = await ConceptService.searchForConceptSuggestions(
            this.props.conceptTypes,
            term,
            this.props.subtypes,
            this.props.associatedWith
        )

        const {seq} = this.state
        if (inSeq !== seq) {
            this.extendState({
                searching: this.state.searching > 0 ? this.state.searching - 1 : 0
            })
            return
        }

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

        this.resetState()

        /**
         * Concepts of type x-im/place needs some special attention
         * since writer/newsitem implementation allows adding but not fetching concepts without geometry
         */
        if (item[propertyMap.ConceptImTypeFull] === 'x-im/place'){
            const geometry = item[propertyMap.ConceptGeometry]

            if (!geometry || (!geometry.includes('POINT') && !geometry.includes('POLYGON'))) {
                return api.ui.showNotification('conceptItemAdd', this.getLabel('Invalid Concept item'), this.getLabel('Invalid or missing Concept geometry'))
            }
        }

        this.props.addItem(item)
    }

    handleKeyDown(e) {
        const { keyCode } = e
        const { selected, searchResult } = this.state
        let selectedItem

        if([27,38,40, 13].includes(keyCode)) {
            e.preventDefault()
            e.stopPropagation()
        }

        switch (keyCode) {
            case 27: // escape
                this.refs.searchInput.val('')
                this.resetState()

                break
            case 38: // arrow up
                this.extendState({
                    selected: (selected > 0) ? selected - 1 : 0
                })

                break
            case 40: // arrow down
                if (searchResult) {

                    let selectedIndex = selected + 1

                    // If creation of new concept is allowed, increase the selection index range by one, to be able to select "create"-option in list
                    if(this.props.creatable && this.state.searchedTerm !== '*' && !this.isPolygon && !this.state.searching) {
                        selectedIndex = (selected === searchResult.length) ? selected : selected + 1
                    }
                    else {
                        selectedIndex = (selected === searchResult.length - 1) ? selected : selected + 1
                    }

                    this.extendState({
                        selected: selectedIndex
                    })
                }

                break
            case 13: // enter
                if (searchResult) {
                    selectedItem = searchResult[this.state.selected]

                    if (selectedItem || this.props.creatable) {
                        this.addItem(selectedItem)
                        this.refs.searchInput.val('')

                        if(selectedItem) {
                            this.resetState()
                        }
                    }
                }

                break
            default:
                break
        }
    }

    get isPolygon() {
        const { subtypes } = this.props
        return (subtypes && subtypes.length === 1 && subtypes[0] === 'polygon')
    }

}

export default ConceptSearchComponent

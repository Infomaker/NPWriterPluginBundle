import {Component} from 'substance'
import {OpenContentClient, QueryBuilder, QueryResponseHelper} from '@infomaker/oc-client'
import {api, UIPagination, UIDropdown} from 'writer'
import SearchResultComponent from './SearchResultComponent'
import OptionsComponent from './OptionsComponent'

class ContentSearchComponent extends Component {

    constructor(...args) {
        super(...args)

        this.handleInput = this.handleInput.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleSearchSubmission = this.handleSearchSubmission.bind(this)
        this.resetState = this.resetState.bind(this)
        this.handleSearchSubmission = this.handleSearchSubmission.bind(this)
        this.setLimit = this.setLimit.bind(this)
        this.setSorting = this.setSorting.bind(this)
        this.setStart = this.setStart.bind(this)
    }

    willReceiveProps(newProps) {
        const { sorting } = newProps
        if (sorting) {
            this.extendState( { sorting })
        }
    }

    getInitialState() {
        return {
            start: 0,
            limit: 25,
            sorting: this.props.sorting,
            query: "",
            results: [],
            totalHits: 0,
            searchTerm: '',
            selectedQuery: this.props.defaultQueries[0]
        }
    }

    /**
     * Reset state
     */
    resetState() {
        this.refs.searchInput.val('')

        this.extendState({
            searching: false,
            searchTerm: '',
            results: [],
            totalHits: 0,
            start: 0
        })
    }

    /**
     * Set start
     *
     * @param {int} start
     */
    setStart(start) {
        this.extendState({ start: (this.state.limit * (start - 1)) })
        this.search()
    }

    /**
     * Set sorting
     *
     * @param {string} sorting
     */
    setSorting(sorting) {
        this.extendState({ sorting, start: 0 })
        this.search()
    }

    /**
     * Set limit
     *
     * @param {int} limit
     */
    setLimit(limit) {
        this.extendState({ limit, start: 0 })
        this.search()
    }

    /**
     * Create dropdown for default queries
     *
     * @param {object} $$ VirtualElement
     */
    renderDropDownComponent($$) {
        return $$(UIDropdown, {
            options: this.props.defaultQueries.map(query => ({ label: query.label, value: query.q })),
            isSelected: (options, item) => {
                return item.label === this.state.selectedQuery.label
            },
            onChangeList: (selected) => {
                const selectedQuery = this.props.defaultQueries.find(query => query.q === selected)
                this.extendState({ selectedQuery })
                this.search()
            },
            disabled: Object.keys(this.props.defaultQueries).length <= 1
        }).ref('dropdownComponent')
    }

    render($$) {
        const dropDownComponent = this.renderDropDownComponent($$)
        const submitInput = $$('input').attr({ type: 'submit', style: 'display:none' })
        const searchInput = $$('input')
            .addClass('form-control search-input col-xs-9')
            .attr('placeholder', this.getLabel('Search...'))
            .on('input', this.handleInput.bind(this))
            .on('keydown', this.handleKeyDown.bind(this))
            .ref('searchInput')

        const searchIcon = $$('i', { 'class': 'content-relations-icon fa fa-search'})
            .on('click', this.handleSearchSubmission)
            .ref('searchIcon')

        const clearSearchIcon = $$('i', { 'class': 'content-relations-icon fa fa-times-circle', 'aria-hidden': 'true'})
            .on('click', this.resetState)
            .ref('clearSearchIcon')

        const searchingIcon = $$('i', { 'class': 'content-relations-icon fa fa-spinner fa-spin', 'aria-hidden': 'true'})

        const searchForm = $$('form', { class: 'content-relations-form' }, [
            submitInput,
            dropDownComponent,
            searchInput,
            this.state.searching ? searchingIcon :
                (this.state.results.length || this.state.searchTerm) ? clearSearchIcon :
                    searchIcon
        ])
            .on('submit', this.handleSearchSubmission)
            .ref('searchForm')

        const optionsComponent = $$(OptionsComponent, {
            totalHits: this.state.totalHits,
            displaying: ((this.state.start + this.state.limit <= this.state.totalHits) ? (this.state.start + this.state.limit) : this.state.totalHits),
            sortings: this.props.sortings,
            sorting: this.state.sorting || this.props.sorting,
            limit: this.state.limit,
            setLimit: this.setLimit,
            setSorting: this.setSorting
        }).ref('optionsComponent')

        const searchResultsComponent = $$(SearchResultComponent, {
            propertyMap: this.props.propertyMap,
            locale: this.props.locale,
            icons: this.props.icons,
            host: this.props.host,
            results: this.state.results,
        }).ref('searchResultsComponent')

        let paginationComponent = this.state.totalHits ? $$(UIPagination, {
            currentPage: Math.ceil((this.state.start / this.state.limit) + 1),
            totalPages: Math.ceil(this.state.totalHits / this.state.limit),
            onPageChange: this.setStart
        }).ref('paginationComponent') : null

        return $$('div', { class: 'content-relations' }, [
            searchForm,
            optionsComponent,
            searchResultsComponent,
            paginationComponent,
        ]).ref('contentRelations')
    }

    /**
     * Handle user input in search field
     */
    handleInput() {
        this.extendState({
            searchTerm: this.refs.searchInput.val()
        })
    }

    /**
     * Handles submission of search form and search button click
     *
     * @param {Event} e
     */
    handleSearchSubmission(e) {
        e.preventDefault()
        this.extendState({ start: 0 })
        this.search()
    }

    /**
     * Handle key down events
     *
     * @param {object} e Event
     */
    handleKeyDown(e) {
        if (e.keyCode === 27) {
            this.resetState()
        }
    }

    /**
     * Do a search against Open Content
     */
    async search() {
        const { contentHost } = this.props
        const { searchTerm, selectedQuery, start, limit, sorting } = this.state
        const responseProperties = Object.keys(this.props.propertyMap).map(key => this.props.propertyMap[key])
        let q = `contenttype:${this.props.contenttype} AND ${selectedQuery.q} ${searchTerm}`.trim()

        if (q.slice(-3) === 'AND') {
            q = q.slice(0, q.length - 4)
        }

        const queryBuilder = new QueryBuilder({ q })
            .setStart(start)
            .setLimit(limit)
            .setResponseProperties(responseProperties)

        if (sorting && sorting.field) {
            queryBuilder.setSorting(this.state.sorting.field, this.state.sorting.ascending)
        }

        if (selectedQuery.contenttype) {
            queryBuilder.queryParams.contenttype = selectedQuery.contenttype
        }

        const query = queryBuilder.build()

        this.extendState({
            searching: true,
        })

        const rawResult = await (new OpenContentClient({ ...contentHost, credentials: 'include', mode: 'cors' })).search(query)
        const jsonResult = await rawResult.json()
        const results = new QueryResponseHelper(jsonResult).getItems()

        this.extendState({
            totalHits: jsonResult.hits.totalHits,
            searching: false,
            results: results
        })
    }
}

export default ContentSearchComponent

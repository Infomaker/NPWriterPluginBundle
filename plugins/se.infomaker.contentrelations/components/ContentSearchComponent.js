import {Component} from 'substance'
import {OpenContentClient, QueryBuilder, QueryResponseHelper} from '@infomaker/oc-client'
import {api, UIPagination} from 'writer'
import SearchResultComponent from './SearchResultComponent'
import OptionsComponent from './OptionsComponent'

class ContentSearchComponent extends Component {

    constructor(...args) {
        super(...args)

        this.DropdownComponent = api.ui.getComponent('DropdownComponent')
    }

    willReceiveProps(newProps) {
        const { sorting } = newProps
        if (sorting) {
            this.extendState( { sorting })
        }
    }

    getInitialState() {
        const host = `${this.props.contentHost.protocol}${this.props.contentHost.hostName}:${this.props.contentHost.port}${this.props.contentHost.objectPath}`

        return {
            host,
            start: 0,
            limit: 15,
            sorting: this.props.sorting,
            query: "",
            results: [],
            totalhits: 0,
            searchTerm: '',
            selectedQuery: this.props.defaultQueries[0]
        }
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
        return $$(this.DropdownComponent, {
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
        const el = $$('div').addClass('content-relations').ref('contentRelations')
        const dropDownComponent = this.renderDropDownComponent($$)
        const submitInput = $$('input').attr({ type: 'submit', style: 'display:none' })
        const searchInput = $$('input')
            .addClass('form-control search-input col-xs-9')
            .attr('placeholder', this.getLabel('Enter query'))
            .on('input', this.handleInput.bind(this))
            .on('keydown', this.handleKeyDown.bind(this))
            .ref('searchInput')

        const searchIcon = $$('i', { 'class': 'content-relations-icon fa fa-search'})
            .on('click', this.search.bind(this))
            .ref('searchIcon')

        const clearSearchIcon = $$('i', { 'class': 'content-relations-icon fa fa-times-circle', 'aria-hidden': 'true'})
            .on('click', this.clear.bind(this))
            .ref('clearSearchIcon')

        const searchingIcon = $$('i', { 'class': 'content-relations-icon fa fa-spinner fa-spin', 'aria-hidden': 'true'})

        const searchForm = $$('form')
            .addClass('content-relations-form')
            .append(submitInput)
            .append(dropDownComponent)
            .append(searchInput)
            .append(
                this.state.searching ? searchingIcon :
                (this.state.results.length || this.state.searchTerm) ? clearSearchIcon :
                searchIcon
            )
            .on('submit', this.search.bind(this))
            .ref('searchForm')

        const optionsComponent = $$(OptionsComponent, {
            totalHits: this.state.totalHits,
            displaying: this.state.results.length,
            sortings: this.props.sortings,
            sorting: this.state.sorting || this.props.sorting,
            limit: this.state.limit,
            setLimit: this.setLimit.bind(this),
            setSorting: this.setSorting.bind(this)
        }).ref('optionsComponent')

        const searchResultsComponent = $$(SearchResultComponent, {
            propertyMap: this.props.propertyMap,
            locale: this.props.locale,
            icons: this.props.icons,
            host: this.state.host,
            results: this.state.results,
        }).ref('searchResultsComponent')

        let pagnationComponent = this.state.totalHits ? $$(UIPagination, {
            currentPage: Math.ceil((this.state.start / this.state.limit) + 1),
            totalPages: Math.ceil(this.state.totalHits / this.state.limit),
            onPageChange: this.setStart.bind(this)
        }) : null

        el.append(searchForm)
            .append(optionsComponent)
            .append(searchResultsComponent)
            .append(pagnationComponent)

        return el
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
     * Handle key down events
     *
     * @param {object} e Event
     */
    handleKeyDown(e) {
        if (e.keyCode === 27) {
            this.clear()
        }
    }

    /**
     * Do a search against Open COntent
     *
     * @param {object} e Event
     */
    async search(e) {
        if (e) {
            e.preventDefault()
        }

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
        console.info('Start: ', start)

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

        const rawResult = await (new OpenContentClient(this.props.contentHost)).search(query)
        const jsonResult = await rawResult.json()
        const results = new QueryResponseHelper(jsonResult).getItems()

        this.extendState({
            totalHits: jsonResult.hits.totalHits,
            searching: false,
            results: results
        })
    }

    clear() {
        this.refs.searchInput.val('')

        this.extendState({
            searching: false,
            searchTerm: '',
            results: [],
            totalHits: 0,
            start: 0
        })
    }
}

export default ContentSearchComponent

import {Component} from 'substance'
import { OpenContentClient, QueryBuilder, QueryResponseHelper } from '@infomaker/oc-client'
import {api} from 'writer'
import SearchResult from './ContentSearchResultComponent'
import ContentOptionsComponent from './ContentOptionsComponent'
import { isObject } from 'lodash'

class ContentSearchComponent extends Component {

    didMount() {
        this.client = new OpenContentClient(this.props.contentHost)
    }

    getInitialState() {
        return {
            limit: 15,
            sorting: this.props.sorting,
            query: "",
            results: [],
            totalhits: 0,
            selectedQuery: this.props.defaultQueries[0]
        }
    }

    setSorting(sorting) {
        this.extendState({ sorting })
        this.search()
    }

    setLimit(limit) {
        this.extendState({ limit })
        this.search()
    }

    renderDropDownComponent($$) {
        const { defaultQueries } = this.props
        const DropdownComponent = api.ui.getComponent('DropdownComponent')
        const dropDownComponent = $$(DropdownComponent, {
            options: defaultQueries.map(query => ({ label: query.label, value: query.q })),
            isSelected: (options, item) => {
                // item.label === this.state.selectedQuery.label
                console.info(item.label, this.state.selectedQuery.label)
            },
            onChangeList: (selectedQuery) => {
                console.info(selectedQuery)
                this.extendState({ selectedQuery })
            },
            disabled: Object.keys(defaultQueries).length <= 1
        })

        return dropDownComponent
    }

    render($$) {
        const el = $$('div').addClass('content-relations')
        const dropDownComponent = this.renderDropDownComponent($$)
        const submitInput = $$('input').attr({ type: 'submit', style: 'display:none' })
        const searchInput = $$('input')
            .addClass('form-control search-input col-xs-9')
            .attr('placeholder', this.getLabel('Enter query'))
            .on('input', this.input.bind(this))
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
                this.state.searchTerm ? clearSearchIcon : 
                searchIcon
            )
            .on('submit', this.search.bind(this))
            .ref('form')

        const contentOptionsComponent = $$(ContentOptionsComponent, {
            totalhits: this.state.totalhits,
            displaying: this.state.results.length,
            sortings: this.props.sortings,
            sorting: this.state.sorting || this.props.sorting,
            setLimit: this.setLimit.bind(this),
            setSorting: this.setSorting.bind(this)
        }).ref('contentOptionsComponent')

        const resultsComponent = $$(SearchResult, {
            results: this.state.results,
        }).ref('resultsComponent')
        
        el.append(searchForm)
            .append(contentOptionsComponent)
            .append(resultsComponent)

        return el
    }

    input() {
        this.extendState({ 
            searchTerm: this.refs.searchInput.val()
        })
    }

    async search(e) {
        if (e) {
            e.preventDefault()
        }

        const {searchTerm, selectedQuery} = this.state
        const responseProperties = Object.keys(this.props.propertyMap).map(key => this.props.propertyMap[key])
        const q = `${selectedQuery.q} ${searchTerm}`.trim()
        const queryBuilder = new QueryBuilder({ q })
            .setStart(0)
            .setLimit(this.state.limit)
            .setResponseProperties(responseProperties)

        if (this.state.sorting.field) {
            queryBuilder.setSorting(this.state.sorting.field, this.state.sorting.ascending)
        }
        
        if (selectedQuery.contenttype) {
            queryBuilder.queryParams.contenttype = selectedQuery.contenttype
        }

        const query = queryBuilder.build()

        this.extendState({
            searching: true,
        })

        const rawResult = await this.client.search(query)
        const jsonResult = await rawResult.json()
        const items = new QueryResponseHelper(jsonResult).getItems()
        const results = []

        items.forEach(item => {
            let props = item.versions[0].properties
            let convertedProps = this._convertProps(props)
            results.push(convertedProps)
        })

        console.info(selectedQuery)
        console.info(query)
        console.info(items)
        console.info(results)

        this.extendState({
            searching: false,
            results: results
        })
    }

    clear() {
        this.refs.searchInput.val('')

        this.extendState({
            searching: false,
            searchTerm: null,
            results: []
        })
    }

    /**
     * Recursive function to map OC array props to POJSO
     * Will follow hierarchy props recursivly
     * 
     * @private
     * 
     * @param {object} props 
     */
    _convertProps(props) {
        const convertedProps = Object.keys(props).reduce((obj, key) => {
            obj[key] = (props[key] && props[key][0]) ? isObject(props[key][0]) ? this._convertProps(props[key][0]) : props[key][0] : ''
            return obj
        }, {})

        return convertedProps
    }
}

export default ContentSearchComponent

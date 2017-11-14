import {Component, FontAwesomeIcon} from 'substance'

import {OpenContentClient, QueryBuilder, QueryResponseHelper} from 'oc-js-client'


/**
 * @class SearchComponent
 */
class SearchComponent extends Component {

    getInitialState() {
        return {
            selectedEndpoint: this._configuredEndpoints[0],
            sortings: [],
            query: '',
            sort: '',
            limit: 25,
            start: 0,
            totalHits: 0
        }
    }

    didMount() {
        this.context.api.events.on('archive-search', 'archive-search:pageChange', (event) => {
            this.extendState({
                start: event.data.pageIndex * this.state.limit
            })

            this._doSearch()
        })


        this._loadSortings()
    }

    dispose() {
        this.context.api.events.off('archive-search', 'search:trigger')
    }

    render($$) {
        return $$('div').append(
            $$('div').addClass('search-container').append(
                $$('form').append(
                    this._renderEndpointPicker($$),
                    this._renderQueryInput($$),
                    $$('a')
                        .attr('href', '')
                        .append(
                            $$(FontAwesomeIcon, {
                                icon: this.state.query ? 'fa-times-circle' : 'fa-search'
                            })
                                .addClass('search-icon')
                        )
                        .on('click', (e) => {
                            e.preventDefault()
                            if (this.state.query) {
                                this._resetQuery()
                            }
                        })
                ).attr('autocomplete', 'off')
                    .on('submit', (e) => {
                        e.stopPropagation()
                        this._doSearch()
                    })
            ),
            $$('div').addClass('search-options').append(
                [this._renderSearchCountInfo($$), ...this._renderSearchOptions($$)]
            )
        )
    }

    _loadSortings() {
        const ocClient = new OpenContentClient(this._ocClientConfig)
        return ocClient.getSortings()
            .then(response => this.context.api.router.checkForOKStatus(response))
            .then(response => response.json())
            .then(({sortings}) => {
                this.extendState({
                    sortings: sortings.map((sorting) => {
                        return {
                            name: sorting.name,
                            field: sorting.sortIndexFields[0].indexField,
                            ascending: sorting.sortIndexFields[0].ascending
                        }
                    })
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    _resetQuery() {
        this.extendState({
            query: '',
            totalHits: 0,
            start: 0
        })
        this.refs.searchInput.val('')
        this.props.clearResult()
    }

    /**
     * @returns {Array}
     * @private
     */
    get _configuredEndpoints() {
        return this.context.api.getConfigValue('se.infomaker.archivesearch', 'archiveHosts', [])
    }

    /**
     * @param $$
     * @private
     */
    _renderQueryInput($$) {
        return $$('div').addClass('form-group flexible-label').append(
            $$('input')
                .addClass('form-control archive-search-input')
                .attr({
                    required: 'required',
                    type: 'text',
                    id: 'archivesearch-input',
                    placeholder: this.getLabel('Search...')
                })
                .ref('searchInput')
                .on('keyup', () => {
                    this.extendState({
                        query: this.refs.searchInput.val()
                    })
                }),
            $$('label')
                .attr('for', 'archivesearch-input')
                .append(
                    this.getLabel('Search...')
                )
        )
    }

    /**
     * @param $$
     * @returns {[VirtualElement]}
     * @private
     */
    _renderSearchCountInfo($$) {
        const summed = this.state.start + this.state.limit
        const showing = summed > this.state.totalHits ? this.state.totalHits : summed

        return $$('div').addClass('count-info')
            .append(
                $$('span').text(
                    `${this.getLabel('Showing')} ${(showing)} ${this.getLabel('of')} ${this.state.totalHits}`
                )
            )
    }

    /**
     * @param $$
     * @private
     */
    _renderEndpointPicker($$) {
        const configuredEndpoints = this._configuredEndpoints
        const DropdownComponent = this.context.api.ui.getComponent('DropdownComponent')

        return $$(DropdownComponent, {
            options: configuredEndpoints.map(({name: label, name: value}) => {
                return {
                    label,
                    value
                }
            }),
            isSelected: (options, item) => item.label === this.state.selectedEndpoint.name,
            onChangeList: (selectedValue) => {
                const selectedEndpoint = this._configuredEndpoints.find(({name}) => selectedValue === name)
                this.extendState({
                    selectedEndpoint
                })
                this._loadSortings()
                    .then(() => {
                        this._resetQuery()
                    })
            },
            disabled: configuredEndpoints.length <= 1
        })
    }

    get _sortingOptions() {
        return [
            {label: 'Relevans', value: ''},
            ...this.state.sortings.map(({name: label, name: value}) => {
                return {
                    label,
                    value
                }
            })]
    }

    /**
     * @param $$
     * @returns {[VirtualElement]}
     * @private
     */
    _renderSearchOptions($$) {
        const DropdownComponent = this.context.api.ui.getComponent('DropdownComponent')

        return [
            $$(DropdownComponent, {
                header: this.getLabel('Sort'),
                options: this._sortingOptions,
                isSelected: (options, item) => item.value === this.state.sort,
                onChangeList: (selectedValue) => {
                    this.extendState({
                        sort: selectedValue
                    })
                    this._doSearch()
                }
            }).ref('sortOptions').addClass('sort-options'),

            $$(DropdownComponent, {
                header: this.getLabel('Show'),
                options: [
                    {label: '10', value: 10},
                    {label: '25', value: 25},
                    {label: '50', value: 50}
                ],
                isSelected: (options, item) => item.value === this.state.limit,
                onChangeList: (selectedValue) => {
                    this.extendState({
                        limit: selectedValue
                    })
                    this._doSearch()
                }
            }).ref('displayOption').addClass('display-options'),
        ]
    }

    get _selectedSorting() {
        const sortObj = this.state.sortings.find(({name}) => name === this.state.sort)
        return sortObj ? sortObj : {field: '', ascending: false}
    }

    /**
     * @returns {Object}
     * @private
     */
    get _query() {
        return Object.assign(this.state.selectedEndpoint.standardQuery, {
            q: this.state.query
        })
    }

    /**
     * @returns {Object}
     * @private
     */
    get _ocClientConfig() {
        return this.state.selectedEndpoint.host
    }

    /**
     * @private
     */
    _doSearch() {
        if (this.state.query === '') {
            return
        }

        const ocClient = new OpenContentClient(this._ocClientConfig)
        const queryBuilder = new QueryBuilder(this._query)
        const resultMappings = this.state.selectedEndpoint.resultsMapping

        console.log(this._selectedSorting.field, this._selectedSorting.ascending)

        queryBuilder.setStart(this.state.start)
            .setSorting(this._selectedSorting.field, this._selectedSorting.ascending)
            .setLimit(this.state.limit)
            .setResponseProperties(Object.keys(resultMappings))

        return ocClient.search(queryBuilder.build())
            .then(response => this.context.api.router.checkForOKStatus(response))
            .then(response => response.json())
            .then(json => new QueryResponseHelper(json))
            .then((qResponse) => {
                const json = {
                    totalHits: qResponse.getTotalHits(),
                    includedHits: qResponse.getIncludedHits()
                }

                json.items = qResponse.getItems().map((versionedItem) => {
                    const item = {
                        uuid: versionedItem.id
                    }

                    const itemProperties = versionedItem.versions[0].properties

                    // Convert { "key": ["value"] } to { "key": "value" }
                    Object.keys(itemProperties)
                        .filter((key) => resultMappings.hasOwnProperty(key))
                        .forEach((key) => {
                            item[resultMappings[key]] = Array.isArray(itemProperties[key]) ? itemProperties[key][0] : itemProperties[key]
                        })

                    return item
                })

                return json
            })
            .then(json => {
                this.extendState({
                    totalHits: json.totalHits
                })
                this.props.onResult({
                    items: json.items,
                    totalHits: json.totalHits,
                    limit: this.state.limit,
                    start: this.state.start
                })
            })
            .catch((e) => {
                console.log(e)
            })
    }
}

export default SearchComponent
import {Component, FontAwesomeIcon} from 'substance'

class SearchComponent extends Component {


    getInitialState() {
        return {
            selectedEndpointUrl: this._configuredEndpoints[0].url,
            query: '',
            sort: '',
            limit: 25,
            start: 0,
            totalHits: 0
        }
    }

    didMount() {
        this.context.api.events.on('archive-search', 'archive:pageChange', (event) => {
            this.extendState({
                start: event.data.pageIndex * this.state.limit
            })

            this._doSearch()
        })
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
                        ).on('click', (e) => {
                            e.preventDefault()
                            if(this.state.query) {
                                this.extendState({
                                    query: '',
                                    totalHits: 0,
                                    start: 0
                                })
                                this.refs.searchInput.val('')
                                this.props.clearResult()
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

    /**
     * @returns {Array}
     * @private
     */
    get _configuredEndpoints() {
        return this.context.api.getConfigValue('se.infomaker.archivesearch', 'archiveHosts', [])
    }

    /**
     * @returns {{host: *, query: *, limit: *, start: *, sort: *}}
     * @private
     */
    get _searchQuery() {
        const {selectedEndpointUrl: host, query, limit, start, sort} = this.state

        console.log(limit)

        return {
            host,
            query,
            limit,
            start,
            sort, //FIXME: get some sorting sorted
            resultMappings: {
                Filename: 'Filename',
                thumbnail: 'thumbnail',
                original: 'primary'
            }
        }
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
            options: configuredEndpoints.map((end) => {
                return {label: end.name, value: end.url}
            }),
            disabled: configuredEndpoints.length <= 1,
            onChangeList: () => {
                console.log('hEHEHE')
            },
            isSelected: () => {
                console.log('wyi')
            }
        })
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
                options: [
                    {label: 'Relevans', value: ''},
                    {label: 'Uppdaterad', value: 'updated'}
                ],
                isSelected: (options, item) => {
                    return item.value === this.state.sort
                },
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
                isSelected: (options, item) => {
                    return item.value === this.state.limit

                },
                onChangeList: (selectedValue) => {
                    this.extendState({
                        limit: selectedValue
                    })
                    this._doSearch()
                }
            }).ref('displayOption').addClass('display-options'),
        ]
    }

    /**
     * @private
     */
    _doSearch() {

        if (this.state.query === '') {
            return
        }

        const requestData = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this._searchQuery)
        }

        return this.context.api.router.post('/api/external-search', requestData)
            .then(response => this.context.api.router.checkForOKStatus(response))
            .then(response => response.json())
            .then((json) => {

                console.log(json)

                json.items = json.items.map((item) => {

                    // TODO: Remove this
                    item.thumbnail = `https://dummyimage.com/${Math.random() * (600 - 300) + 300}x400/${(Math.random() * (65536)).toString(16)}/fff.jpg`

                    // Convert { "key": ["value"] } to { "key": "value" }
                    Object.keys(item).forEach((key) => {
                        item[key] = Array.isArray(item[key]) ? item[key][0] : item[key]
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
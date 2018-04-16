import { Component } from 'substance'
import ConceptItemModel from '../models/ConceptItemModel'
import ConceptMapComponent from './ConceptMapComponent'

class ConceptDialogComponent extends Component {

    constructor(...args) {
        super(...args)

        this.send = this.send.bind(this)
    }

    getInitialState() {
        return {
            loading: true,
            uiGroups: []
        }
    }

    dispose() {
        this.conceptItemModel = null
        Object.keys(this.refs).forEach(ref => {
            const input = this.refs[ref]
            input.el.el.removeEventListener('input', this.validateInput.bind(this), true)
        })
    }

    async didMount() {
        this.send('dialog:disablePrimaryBtn')
        this.conceptItemModel = new ConceptItemModel(this.props.item, this.props.config, this.props.propertyMap)

        const uiGroups = await this.conceptItemModel.getUiGroups()
        const errors = uiGroups.filter(group => {
            return group.error
        })

        if (errors.length) {
            this.extendState({
                loading: false,
                uiGroups: [],
                errors: errors
            })
        } else {
            this.send('dialog:enablePrimaryBtn')

            this.extendState({
                loading: false,
                uiGroups: uiGroups,
                errors: null
            })
        }

        // Bind validation listeners and trigger first validation
        Object.keys(this.refs).forEach(ref => {
            const input = this.refs[ref]
            input.el.el.removeEventListener('input', this.validateInput.bind(this), true)
            input.el.el.addEventListener('input', this.validateInput.bind(this), true)
            input.el.el.dispatchEvent(new Event('input'))
        })
    }

    validateInput(e) {
        if (e.target.pattern && e.target.pattern !== '') {
            const reg = new RegExp(e.target.pattern)
            if (reg.test(e.target.value)) {
                document.querySelector('.btn.sc-np-btn.btn-primary').disabled = false
                e.target.classList.remove('invalid')
            } else {
                document.querySelector('.btn.sc-np-btn.btn-primary').disabled = true
                e.target.classList.add('invalid')
            }
        }
    }

    render($$) {
        const el = $$('div').addClass('concept-dialog-component col-sm-12')

        if (this.state.loading) {
            const spinner = $$('i', {
                class: 'fa fa-spinner fa-spin dialog-spinner',
                "aria-hidden": 'true'
            })
            el.append(spinner)
        }

        if (this.state.errors) {
            const errorEl = $$('div').addClass('warning')

            this.state.errors.forEach(errorObject => {
                errorEl.append($$('p').append(errorObject.error))
            })

            el.append(errorEl)
        }

        if (this.state.uiGroups.length) {
            this.state.uiGroups.forEach(uiGroup => {
                const fields = []
                const title = $$('h2').append(uiGroup.title)
                const groupTitle = $$('div').append(title).addClass('concept-form-title')

                uiGroup.fields.forEach((field) => {
                    let group
                    switch (field.type) {
                        case 'text':
                            group = this.generateTextFormGroup($$, field)
                            break

                        case 'string':
                        case 'url':
                        case 'email':
                        case 'tel':
                            group = this.generateInputFormGroup($$, field)
                            break

                        case 'geo':
                            group = this.generateMap($$, field)
                            break

                        default:
                            break
                    }

                    fields.push(group)
                })

                if (fields.length) {
                    el.append(groupTitle)
                    el.append(fields)
                }
            })
        }

        return el
    }

    generateFormGroup($$) {
        return $$('div').addClass('concept-form-group')
    }

    generateLabel($$, field) {
        return $$('label', { for: field.label, class: 'concept-form-label' }).append(field.label)
    }

    generateInputFormGroup($$, field) {
        const input = $$('input', { id: field.label, class: 'concept-form-control', type: field.type, value: field.value ? field.value : '', placeholder: field.placeholder, pattern: field.validation }).ref(field.refId)

        return this.generateFormGroup($$)
            .append(this.generateLabel($$, field))
            .append(input)
    }

    generateTextFormGroup($$, field) {
        const rows = (field.value && field.value.length) ? (field.value.length / 80) + 2 : 3
        const textarea = $$('textarea', { id: field.label, class: 'concept-form-control', placeholder: field.placeholder, rows: rows }).append(field.value ? field.value : '').ref(field.refId)

        return this.generateFormGroup($$)
            .addClass('textarea-group')
            .append(this.generateLabel($$, field))
            .append(textarea)
    }

    generateMap($$, field) {
        const mapGroupContainer = $$('div').addClass('concept-map-group')
        const hiddenValueInput = $$('input', { type: 'text', value: field.value ? field.value : '' }).ref(field.refId)
        let searchInput, searchSpinner, searchResultWrapper = $$('div').addClass('location-result-wrapper'), mapsWrapper = $$('div').addClass('maps-wrapper')

        if (field.editable && !this.isPolygon()) {
            searchInput = $$('input', { type: 'text', placeholder: this.getLabel('Place or location search'), class: 'location-form-control' }).ref('locationSearch')

            if (this.state.searching) {
                searchSpinner = $$('i', {
                    class: 'fa fa-spinner fa-spin location-search-icon',
                    "aria-hidden": 'true'
                })
            }

            if (this.state.searchResult) {
                const resultItems = this.state.searchResult.map(hit => {
                    return $$('div', { class: 'result-item' }, [
                        $$('strong', {}, `${hit.name}: `),
                        hit.formatted_address
                    ])
                    .on('click', () => {
                        if (hit.geometry && hit.geometry.location) {
                            this.refs[field.refId].val(`POINT(${hit.geometry.location.lng()} ${hit.geometry.location.lat()})`)
                            this.refs.conceptMapComponent.setProps({
                                latLng: {
                                    lat: hit.geometry.location.lat(),
                                    lng: hit.geometry.location.lng()
                                }
                            })
                        }
                        this.refs.locationSearch.val('')

                        this.extendState({
                            searchResult: false
                        })
                    })
                })

                searchResultWrapper.append(resultItems)
            }
        } else {
            searchInput = $$('p').append(this.getLabel('No polygon edit'))
        }

        mapsWrapper
            .append(searchInput)
            .append(searchSpinner)
            .append(searchResultWrapper)

        if (this.props.config.googleMapAPIKey) {
            const map = $$(ConceptMapComponent, {
                apiKey: this.props.config.googleMapAPIKey,
                searchedTerm: this.props.item.searchedTerm || false,
                searchedTermPosition: (lat, lng) => {
                    this.refs[field.refId].val(`POINT(${lng} ${lat})`)
                    this.refs.locationSearch.val(this.props.item.searchedTerm)
                },
                markerPositionChanged: (lat, lng) => {
                    this.refs[field.refId].val(`POINT(${lng} ${lat})`)
                    console.info(`POINT(${lng} ${lat})`)
                },
                searchResult: (results) => {
                    this.extendState({
                        searchResult: results,
                        searching: false
                    })
                },
                loaded: () => {
                    this.refs.conceptMapComponent.setProps(this.extractItemGeometry())
                }
            }).ref('conceptMapComponent')

            mapsWrapper.append(map)
            searchInput.on('keyup', () => {
                const term = this.refs.locationSearch.val()

                if (term !== this.state.term) {
                    if (term && term.length > 1) {
                        this.extendState({ searching: true, term })
                        this.refs.conceptMapComponent.extendProps({ term })
                    } else {
                        this.extendState({
                            searching: false,
                            searchResult: false
                        })
                    }
                }
            })
        }

        const group = this.generateFormGroup($$)
            .append(this.generateLabel($$, field))
            .append(hiddenValueInput)
            .addClass('hidden')

        return mapGroupContainer
            .append(group)
            .append(mapsWrapper)

    }

    isPolygon() {
        const { item } = this.props
        const geometry = (item && item.data) ? item.data.geometry : ''
        return (geometry.indexOf('POLYGON') !== -1)
    }

    isMultiPolygon() {
        const { item } = this.props
        const geometry = (item && item.data) ? item.data.geometry : ''
        return (geometry.indexOf('MULTIPOLYGON') !== -1)
    }

    extractItemGeometry() {
        const { item } = this.props
        const geometry = (item && item.data) ? item.data.geometry : false

        if (geometry) {
            return this.isMultiPolygon(geometry) ?
                this._extractMultiPolygon(geometry) : this.isPolygon() ?
                this._extractPolygon(geometry) :
                this._extractLatLng(geometry)
        } else {
            return {}
        }
    }

    _extractLatLng(geometryString) {
        const latLongString = /POINT\(([0-9\-\.\s]+)\)/.exec(geometryString || '')[1].split(' ')

        return {
            latLng: {
                lat: latLongString[1] || 0,
                lng: latLongString[0] || 0
            }
        }
    }

    _extractMultiPolygon(geometryString) {
        const multiPtsArray = []
        const polygons = geometryString.match(/\(\([0-9 \.\,\-]+\)\)/g)

        polygons.forEach(polygon => {
            multiPtsArray.push(
                this._extractPolygon(polygon).ptsArray
            )
        })

        return {
            multiPtsArray
        }
    }

    _extractPolygon(geometryString) {
        const ptsArray = []
        geometryString = geometryString.replace(/ +(?= )/g, '')

        function addPoints(data) {
            const pointsData = data.split(",")

            pointsData.forEach(point => {
                ptsArray.push(point.trim().split(" "))
            })
        }

        //Get ring if there's many
        const regex = /\(([^()]+)\)/g
        let results
        do {
            results = regex.exec(geometryString)
            if (results) {
                addPoints(results[1])
            }
        } while (results)

        return { ptsArray }
    }

    async onClose(action) {
        if (action === 'save') {
            this.props.save(
                await this.conceptItemModel.save(this.refs)
            )
        }
    }

}

export default ConceptDialogComponent
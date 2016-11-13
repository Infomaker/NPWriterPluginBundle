import {Component} from 'substance'

class SearchComponent extends Component {

    constructor(...args) {
        super(...args)
    }


    getInitialState() {
        return {
            searchResults: [],
            googleMapsLoaded: false
        }
    }

    didMount() {

        //this.search(this.props.query)
    }

    willReceiveProps(props) {
        let newState = {}
        if (props.google) {
            this.google = props.google
            newState.googleMapsLoaded = true

            if (props.query) {
                newState.query = props.query
                this.populateInitialQuery(props.query)
            }
        }

        if (Object.keys(newState).length > 0) {
            this.extendState(newState)
        }

    }

    populateInitialQuery(initialQuery) {
        this.makeInitialSearch(initialQuery)
    }

    render($$) {

        var el = $$('div').addClass('search-container').ref('searchContainer')
        var tmpSearch = $$('div').ref('tmpSearchContainer')
        el.append(tmpSearch)

        var container = $$('div').ref('searchContainer').addClass('search-component__main clearfix')


        if (this.state.googleMapsLoaded) {

            var searchForm = $$('form').attr('style', 'display:flex')
                .on('submit', this.search.bind(this)).ref('searchForm')

            var searchInput = $$('input')
                .addClass('form-control search__query col-xs-9')
                .ref('searchInput')
                .val(this.state.query)
                .attr('placeholder', this.getLabel('Address or place'))

            var searchButton = $$('button')
                .addClass('btn btn-neutral col-xs-3')
                .append(this.getLabel('Search'))
                .on('click', this.search.bind(this))
                .ref('serchButton')

            searchForm.append([searchInput, searchButton])
            container.append(searchForm)

            var searchList = $$('ul').ref('searchList')
            var items = this.state.searchResults.map(function (result) {

                //TODO: Maybe present some additional info such as address and image?
                var lat = result.geometry.location.lat()
                var lng = result.geometry.location.lng()

                return $$('li').append(result.name).on('click', function () {
                    this.send('searchItemSelected', new google.maps.LatLng(lat, lng))
                }.bind(this))
            }.bind(this))

            searchList.append(items)

            if (this.state.isSearching) {
                container.append(searchList)
            }

            el.append(container)
        } else {
            el.append($$('span').append('Waiting for maps to load'))
        }

        return el
    }


    /**
     * When search is done check that response is ok and update state
     * @param {array} results
     * @param {oogle.maps.places.PlacesServiceStatus} status
     */
    searchDone(results, status) {
        if (status === this.google.maps.places.PlacesServiceStatus.OK && results[0]) {
            this.extendState({
                searchResults: results
            })
        }
    }

    search(e) {
        this.extendState({
            isSearching: true
        })
        e.preventDefault()
        var request = {
            query: this.refs.searchInput.val()
        }
        var service = new this.google.maps.places.PlacesService(this.refs.tmpSearchContainer.el.el)
        service.textSearch(request, this.searchDone.bind(this))
    }


    /**
     * Makes the initial search when loading the mapComponent first time
     * @param query
     */
    makeInitialSearch(query) {
        var request = {
            query: query
        }
        var service = new this.google.maps.places.PlacesService(this.refs.tmpSearchContainer.el.el)
        service.textSearch(request, function (results, status) {
            if (status === this.google.maps.places.PlacesServiceStatus.OK && results[0]) {
                var lat = results[0].geometry.location.lat()
                var lng = results[0].geometry.location.lng()
                this.send('searchItemSelected', new google.maps.LatLng(lat, lng))
            }
        }.bind(this))

    }
}

export default SearchComponent

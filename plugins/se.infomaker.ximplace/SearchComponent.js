'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;

function SearchComponent() {
    SearchComponent.super.apply(this, arguments);
}

SearchComponent.Prototype = function() {


    this.getInitialState = function() {
        return {
            searchResults: []
        };
    };

    this.didMount = function() {
        //this.search(this.props.query);
    };

    this.didReceiveProps = function() {
        if(this.props.google) {
            this.google = this.props.google;

            if(!this.state.googleMapsLoaded) {
                this.setState({
                    googleMapsLoaded:true,
                    searchResults: this.state.searchResults
                });
            }
            if(this.props.query) {
                this.populateInitialQuery();
            }

        }
    };

    this.populateInitialQuery = function() {
        this.refs.searchInput.val(this.props.query);
        this.makeInitialSearch(this.props.query);
    };

    this.render = function() {

        var el = $$('div').addClass('search-container').ref('searchContainer');
        var tmpSearch = $$('div').ref('tmpSearchContainer');
        el.append(tmpSearch);

        var container = $$('div').ref('searchContainer').addClass('search-component__main clearfix');


        if(this.state.googleMapsLoaded) {

            var searchForm = $$('form')
                .on('submit', this.search.bind(this)).ref('searchForm');

            var searchInput = $$('input')
                .addClass('form-control search__query col-xs-9')
                .ref('searchInput')
                .attr('placeholder', this.context.i18n.t('Address or place'));

            var searchButton = $$('button')
                .addClass('btn btn-neutral col-xs-3')
                .append(this.context.i18n.t('Search'))
                .on('click', this.search.bind(this))
                .ref('serchButton');

            searchForm.append([searchInput, searchButton]);
            container.append(searchForm);

            var searchList = $$('ul').ref('searchList');
            var items = this.state.searchResults.map(function(result) {

                //TODO: Maybe present some additional info such as address and image?
                var lat = result.geometry.location.lat();
                var lng = result.geometry.location.lng();

                return $$('li').append(result.name).on('click', function () {
                    this.send('searchItemSelected', new google.maps.LatLng(lat, lng));
                }.bind(this));
            }.bind(this));

            searchList.append(items);

            if(this.state.isSearching) {
                container.append(searchList);
            }

            el.append(container);
        } else {
            el.append($$('span').append('Waiting for maps to load'));
        }

        return el;
    };


    /**
     * When search is done check that response is ok and update state
     * @param {array} results
     * @param {oogle.maps.places.PlacesServiceStatus} status
     */
    this.searchDone = function(results, status) {
        if(status === this.google.maps.places.PlacesServiceStatus.OK && results[0]) {
            this.extendState({
                searchResults: results
            });
        }
    };

    this.search = function(e) {
        this.extendState({
            isSearching: true
        });
        e.preventDefault();
        var request = {
            query: this.refs.searchInput.val()
        };
        var service = new this.google.maps.places.PlacesService(this.refs.tmpSearchContainer.el);
        service.textSearch(request, this.searchDone.bind(this));
    };


    /**
     * Makes the initial search when loading the mapComponent first time
     * @param query
     */
    this.makeInitialSearch = function(query) {
        var request = {
            query: query
        };
        var service = new this.google.maps.places.PlacesService(this.refs.tmpSearchContainer.el);
        service.textSearch(request, function(results, status) {
            if(status === this.google.maps.places.PlacesServiceStatus.OK && results[0]) {
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                this.send('searchItemSelected', new google.maps.LatLng(lat, lng));
            }
        }.bind(this));
    };
};

Component.extend(SearchComponent);
module.exports = SearchComponent;
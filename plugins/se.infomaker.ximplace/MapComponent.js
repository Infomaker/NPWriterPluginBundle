'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Icon = require('substance/ui/FontAwesomeIcon');
var GoogleMapsLoader = require('./lib/Google'); // only for common js environments

function MapComponent() {
    MapComponent.super.apply(this, arguments);
    this.name = 'location';
    this.apiKey = this.context.api.getConfigValue(this.name, 'googleMapAPIKey');

    GoogleMapsLoader.KEY = this.apiKey;
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    GoogleMapsLoader.onLoad(function (google) {
        this.googleMapsLoaded(google);
    }.bind(this));
}

MapComponent.Prototype = function () {

    this.handleWKTPolygon = function (wktString) {

        function addPoints(google, data) {
            var pointsData = data.split(",");
            var len = pointsData.length;
            for (var i = 0; i < len; i++) {
                var xy = pointsData[i].split(" ");

                var pt = new google.maps.LatLng(xy[1], xy[0]); // Make to Google LatLng format
                ptsArray.push(pt);
            }
        }

        //Get ring if there's many
        var regex = /\(([^()]+)\)/g;
        var wktRings = [];
        var results;
        while (results = regex.exec(wktString)) {
            wktRings.push(results[1]);
        }

        var ptsArray = [];
        for (var i = 0; i < wktRings.length; i++) {
            addPoints(this.google, wktRings[i]);
        }

        var poly = new this.google.maps.Polygon({
            paths: ptsArray,
            strokeColor: '#3A99D9',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#1E90FF',
            fillOpacity: 0.35
        });

        poly.setMap(this.map);
        this.map.setZoom(9);

    };

    this.dispose = function () {
        GoogleMapsLoader.release(function () {
            //Release the google maps on dispose of component
        });
    };

    this.getDefaultMapOptions = function () {
        var latlng = new google.maps.LatLng(56.683687, 16.363279);
        return {
            zoom: 14,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
        };
    };

    this.googleMapsLoaded = function (google) {
        this.google = google;
        this.map = new google.maps.Map(this.refs.mapContainer.el, this.getDefaultMapOptions());
        this.send('googleMapsLoaded', google);
    };

    /**
     * Set marker
     * @param {google.maps.Marker} googleLatLong
     */
    this.setMarker = function (googleLatLong) {
        if (this.marker) {
            this.marker.position = googleLatLong;
        } else {
            this.marker = new google.maps.Marker({
                position: googleLatLong,
                icon: {
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    strokeColor: '#2a6f9e',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: '#3A99D9',
                    fillOpacity: 0.35,
                    scale: 4
                },
                draggable: true
            });

            this.marker.addListener('dragend', function (event) {
                this.send('markerPositionChanged', {lat: event.latLng.lat(), lng: event.latLng.lng()});
            }.bind(this));
        }

        this.marker.setMap(this.map);
    };

    this.updateMapLocation = function (googleLatLng) {
        this.map.setCenter(googleLatLng);
        this.setMarker(googleLatLng);
    };

    this.didMount = function () {
        this.loadGoogleMaps();
    };

    this.loadGoogleMaps = function () {
        GoogleMapsLoader.load(function (google) {
        }.bind(this));

    };

    this.didReceiveProps = function () {
        if (this.props.googleLatLng) {
            this.updateMapLocation(this.props.googleLatLng);
        } else if(this.props.isPolygon) {
            this.handleWKTPolygon(this.props.wktString);
        }
    };

    this.render = function () {
        // https://developers.google.com/maps/documentation/javascript/events
        var el = $$('div');
        var mapContainer = $$('div').attr('id', 'map-container').ref('mapContainer');
        el.append(mapContainer);
        return el;
    };

};

Component.extend(MapComponent);
module.exports = MapComponent;

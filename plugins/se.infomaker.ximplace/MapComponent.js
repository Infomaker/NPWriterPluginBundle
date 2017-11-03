import {Component} from 'substance'
import GoogleMapsApiLoader from 'google-maps-api-loader'

class MapComponent extends Component {

    constructor(...args) {
        super(...args)

    }


    handleWKTPolygon(wktString) {
        var ptsArray = []

        function addPoints(google, data) {
            var pointsData = data.split(",")
            var len = pointsData.length

            for (var i = 0; i < len; i++) {
                var xy = pointsData[i].trim().split(" ")

                var pt = new google.maps.LatLng(xy[1], xy[0]); // Make to Google LatLng format
                ptsArray.push(pt)
            }
        }

        //Get ring if there's many
        var regex = /\(([^()]+)\)/g
        var wktRings = []
        var results

        wktString = wktString.replace(/ +(?= )/g, '')
        do {
            results = regex.exec(wktString)
            if (results) {
                wktRings.push(results[1])
            }


        } while (results)

        for (var i = 0; i < wktRings.length; i++) {
            addPoints(this.google, wktRings[i])
        }

        var polygon = new this.google.maps.Polygon({
            paths: ptsArray,
            strokeColor: '#3A99D9',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#1E90FF',
            fillOpacity: 0.35
        })

        polygon.setMap(this.map)

        // Fit Polygon path bounds
        var bounds = new google.maps.LatLngBounds()
        polygon.getPath().forEach(function (path) {
            bounds.extend(path)
        })
        this.map.fitBounds(bounds);
    }

    dispose() {
        this.map.unbindAll()
        // this.google.release(function () {
        //     Release the google maps on dispose of component
        // })
    }

    getDefaultMapOptions() {
        var latlng = new google.maps.LatLng(56.683687, 16.363279)
        return {
            zoom: 14,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
        }
    }

    didMount() {
        var apiKey = this.context.api.getConfigValue(this.props.pluginId, 'googleMapAPIKey')

        GoogleMapsApiLoader({
            libraries: ['geometry', 'places'],
            apiKey: apiKey
        }).then(googleApi => {
            this.googleMapsLoaded(googleApi)
        }, err => {
            console.error(err);
        })

    }

    googleMapsLoaded(google) {
        this.google = google
        let mapContaienr = document.getElementById('map-container')
        this.map = new google.maps.Map(mapContaienr, this.getDefaultMapOptions())
        this.send('googleMapsLoaded', google)
    }

    /**
     * Set marker
     * @param {google.maps.Marker} googleLatLong
     */
    setMarker(googleLatLong) {
        if (this.marker) {
            this.marker.position = googleLatLong
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
            })

            this.marker.addListener('dragend', function (event) {
                this.send('markerPositionChanged', {lat: event.latLng.lat(), lng: event.latLng.lng()})
            }.bind(this))
        }

        this.marker.setMap(this.map)
    }

    updateMapLocation(googleLatLng) {
        this.map.setCenter(googleLatLng)
        this.setMarker(googleLatLng)
    }

    willReceiveProps(props) {
        if (props.googleLatLng) {
            this.updateMapLocation(props.googleLatLng)
        } else if (props.isPolygon) {
            this.handleWKTPolygon(props.wktString)
        }
    }

    // Prevent rerender on this MapComponent
    // When rerender the google map disappears
    shouldRerender() {
        return false
    }


    render($$) {
        // https://developers.google.com/maps/documentation/javascript/events
        var el = $$('div').ref('mapComponent')
        var mapContainer = $$('div').attr('id', 'map-container').ref('mapContainer')
        el.append(mapContainer)
        return el
    }

}

export default MapComponent

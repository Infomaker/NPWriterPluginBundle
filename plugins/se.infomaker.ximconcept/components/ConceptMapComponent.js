import { Component } from 'substance'
import GoogleMapsApiLoader from 'google-maps-api-loader'

class ConceptMapComponent extends Component {

    setGoogleApi(googleApi) {
        window._googleApi = googleApi
    }

    getGetGoogleApi() {
        return window._googleApi
    }

    shouldRerender() {
        return false
    }

    dispose() {
        if (this.map) {
            this.map.unbindAll()
        }
    }

    willReceiveProps(newProps) {

        if (newProps.markerPositionChanged) {
            this.extendState({ markerPositionChanged: newProps.markerPositionChanged })
        }

        if (this.map) {
            if (newProps.geoJson) {
                this.setGeJson(newProps.geoJson)
            }
            else if (newProps.latLng) {
                const googleLatLng = new google.maps.LatLng(newProps.latLng.lat, newProps.latLng.lng)
                this.setMarker(googleLatLng)

            } else if (newProps.googleLatLng) {
                this.setMarker(newProps.googleLatLng)

            } else if (newProps.term) {
                this.searchPlaces(newProps.term)
            }
        }
    }

    getDefaultMapOptions() {
        let latLng = new google.maps.LatLng(56.683687, 16.363279)
        return {
            zoom: 14,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,

            zoomControl: true,
            gestureHandling: 'cooperative',
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
        }
    }

    async didMount() {
        if (!this.getGetGoogleApi()) {

            /**
             * This will create a google object on the global namespace
             */
            const googleApi = await GoogleMapsApiLoader({
                libraries: ['geometry', 'places'],
                apiKey: this.props.apiKey,
            })

            this.setGoogleApi(googleApi)
        }

        this.googleApi = this.getGetGoogleApi()

        try {
            this.refs.mapContainer.addClass('visible')

            if (!this.map) {
                const defaultMapOptions = this.getDefaultMapOptions()
                this.map = new google.maps.Map(
                    this.refs.mapContainer.el.el,
                    defaultMapOptions
                )
            }

            if (this.props.searchedTerm) {
                const results = await this.searchPlaces(this.props.searchedTerm)

                if (results && results.length) {
                    const googleLatLng = new google.maps.LatLng(
                        results[0].geometry.location.lat(),
                        results[0].geometry.location.lng()
                    )

                    this.props.searchedTermPosition(
                        results[0].geometry.location.lat(),
                        results[0].geometry.location.lng()
                    )

                    this.setMarker(googleLatLng)
                }
            }

            this.props.loaded()

        } catch (error) {
            console.warn('Error loading map: ', error)
            this.refs.mapContainer.removeClass('visible')
        }
    }

    setMarker(googleLatLng) {
        if (this.marker) {
            this.marker.position = googleLatLng
        } else {
            this.marker = new google.maps.Marker({
                position: googleLatLng,
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

            this.marker.addListener('dragend',(event) => {
                if (this.state.markerPositionChanged) {
                    this.state.markerPositionChanged(event.latLng.lat(), event.latLng.lng())
                }
            })
        }
        this.marker.setMap(this.map)
        this.map.setCenter(googleLatLng)
    }

    setGeJson(geoJson) {
        this.map.data.addGeoJson(geoJson)
        this.map.data.setStyle({
            strokeColor: '#3A99D9',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#1E90FF',
            fillOpacity: 0.35
        })
        this._fitBounds()
    }

    _fitBounds() {
        const bounds = new google.maps.LatLngBounds()
        this.map.data.forEach((feature) => {
            feature.getGeometry().forEachLatLng((latlng) => {
                bounds.extend(latlng);
            })
        })

        this.map.fitBounds(bounds)
    }

    searchPlaces(query) {
        return new Promise(resolve => {
            this.service = this.service || new google.maps.places.PlacesService(this.map)
            this.service.textSearch({ query }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    this.props.searchResult(results)
                    resolve(results)
                } else {
                    this.props.searchResult([])
                    resolve([])
                }
            })
        })
    }

    render($$){
        const el = $$('div').addClass('concept-map-component')
        const mapContainer = $$('div', {
            class: 'map-container',
            id: 'map-container',
        }).ref('mapContainer')

        return el.append(mapContainer)
    }

}

export default ConceptMapComponent
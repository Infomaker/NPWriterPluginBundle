import { Component } from 'substance'
import GoogleMapsApiLoader from 'google-maps-api-loader'

class ConceptMapComponent extends Component {

    constructor(...args) {
        super(...args)

        this.polygons = []
    }

    shouldRerender() {
        return false
    }

    dispose() {
        if (this.map) {
            this.map.unbindAll()
        }

        if (this.polygons) {
            delete this.polygons
        }
    }

    convertPtsToGooglPts(ptsArray) {
        return ptsArray.map(point => {
            return new google.maps.LatLng(point[1], point[0])
        })
    }

    willReceiveProps(newProps) {

        if (newProps.markerPositionChanged) {
            this.extendState({ markerPositionChanged: newProps.markerPositionChanged })
        }

        if (this.map) {
            if (newProps.latLng) {
                const googleLatLng = new google.maps.LatLng(newProps.latLng.lat, newProps.latLng.lng)
                this.setMarker(googleLatLng)

            } else if (newProps.googleLatLng) {
                this.setMarker(newProps.googleLatLng)

            } else if (newProps.ptsArray) {
                const googlePtsArray = this.convertPtsToGooglPts(newProps.ptsArray)
                this.setPolygon(googlePtsArray)
            } else if (newProps.multiPtsArray) {
                newProps.multiPtsArray.forEach(ptsArray => {
                    const googlePtsArray = this.convertPtsToGooglPts(ptsArray)
                    this.setPolygon(googlePtsArray)
                })
                this._fitBounds()
            } else if (newProps.term) {
                this.searchPlaces(newProps.term)
            }
        }
    }

    getDefaultMapOptions() {
        let latlng = new google.maps.LatLng(56.683687, 16.363279)
        return {
            zoom: 14,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,

            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
        }
    }

    async didMount() {
        const apiKey = this.props.apiKey

        try {
            this.refs.mapContainer.addClass('visible')

            if (!this.googleApi) {

                /**
                 * This will create a google object on the global namespace
                 */
                this.googleApi = await GoogleMapsApiLoader({
                    libraries: ['geometry', 'places'],
                    apiKey: apiKey,
                })
            }

            if (!this.map) {
                this.map = new google.maps.Map(
                    this.refs.mapContainer.el.el,
                    await this.getDefaultMapOptions()
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

    setPolygon(ptsArray) {
        const polygon = new google.maps.Polygon({
            paths: ptsArray,
            strokeColor: '#3A99D9',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#1E90FF',
            fillOpacity: 0.35
        })
        polygon.setMap(this.map)
        this.polygons.push(polygon)

        this._fitBounds()
    }

    _fitBounds() {
        const bounds = new google.maps.LatLngBounds()
        
        this.polygons.forEach(polygon => {
            polygon.getPath().forEach(function (path) {
                bounds.extend(path)
            })
        })
        
        this.map.fitBounds(bounds)
    }

    searchPlaces(query) {
        return new Promise(resolve => {
            this.service = this.service || new google.maps.places.PlacesService(this.map)
            this.service.textSearch({ query }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
                    if (this.props.searchResult) {
                        this.props.searchResult(results)
                    }
                    resolve(results)
                }
                resolve([])
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
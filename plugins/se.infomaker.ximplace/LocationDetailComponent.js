'use strict';

import {Component} from 'substance'
import MapComponent from './MapComponent'
import SearchComponent from './SearchComponent'
import {jxon} from 'writer'
import {idGenerator} from 'writer'
import {lodash} from 'writer'

const isArray = lodash.isArray
const isObject = lodash.isObject
const find = lodash.find

class LocationDetailComponent extends Component {

    constructor(...args) {
        super(...args)

        // action handlers
        this.handleActions({
            'googleMapsLoaded': this.googleMapsLoaded,
            'searchItemSelected': this.searchItemSelected,
            'markerPositionChanged': this.markerPositionChanged
        })
    }

    dispose() {
        // TODO Abort on fetch method?
        // if (this.ajaxRequest) {
        //     this.ajaxRequest.abort()
        // }
        super.dispose()
    }

    /**
     * Creates an Id and update the id property on contept.metadata.object.id
     */
    createIdForObject() {
        this.state.location.concept.metadata.object['@id'] = idGenerator()
    }

    createLocation() {
        var location = this.state.location,
            url = '/api/newsitem'

        this.createIdForObject()

        this.saveLocation(url, 'POST')
            .then(response => this.context.api.router.checkForOKStatus(response))
            .then(response => response.text())
            .then(uuid => {
                // Update tag in newsItem
                this.context.api.newsItem.addLocation(this.name, {
                    title: location.concept.name,
                    data: this.getGeometryObject(),
                    uuid: uuid,
                    type: this.getLocationType()
                })

                this.props.reload()
                this.send('close')
            }).catch(err => console.error(err))
    }

    updateLocation() {
        var location = this.state.location;
        var uuid = location['@guid'] ? location['@guid'] : null
        if (!uuid) {
            throw new Error("ConceptItem has no UUID to update")
        }
        var url = '/api/newsitem/' + uuid

        this.saveLocation(url, 'PUT')
            .then(response => this.context.api.router.checkForOKStatus(response))
            .then(response => response.text())
            .then(() => {
                // Update tag in newsItem
                this.context.api.newsItem.updateLocation(this.name, {
                    title: location.concept.name,
                    data: this.getGeometryObject(),
                    uuid: uuid,
                    type: this.getLocationType()
                })
                this.props.reload()
                this.send('close')
            }).catch(err => console.error(err));
    }

    getGeometryObject() {
        var geometry = findAttribute(this.state.location, 'geometry')
        if (geometry) {
            return {
                position: this.state.location.concept.metadata.object.data.geometry
            }
        } else {
            return {}
        }
    }

    /**
     * Sets the definition description
     *
     * @param {string} inputValue The form value filled in by user
     * @param {string} role The definition type, drol:short or drol:long
     */
    setDescription(inputValue, role) {
        var currentDescription = this.context.api.concept.getDefinitionForType(this.state.location.concept.definition, role)
        if (inputValue.length > 0 && !currentDescription) {
            var longDesc = {'@role': role, keyValue: inputValue}
            this.state.location.concept.definition = this.conceptUtil.setDefinitionDependingOnArrayOrObject(this.state.location.concept.definition, longDesc)
        } else if (inputValue.length >= 0 && currentDescription) {
            currentDescription['keyValue'] = inputValue
        }
    }


    /**
     * Method that saves conceptItem to backend
     * @param {string} url
     * @param {string} method POST, PUT
     * @returns {*} Returns jQuery ajax promise
     */
    saveLocation(url, method) {
        var location = this.state.location
        location.concept.name = this.refs.locationNameInput.val().length > 0 ? this.refs.locationNameInput.val() : location.concept.name

        var shortDescriptionInputValue = this.refs.locationShortDescInput.val()
        var longDescriptionInputValue = this.refs.locationLongDescText.val()

        // Check if definition exists
        if (!location.concept.definition) {
            location.concept.definition = []
        }

        this.setDescription(shortDescriptionInputValue, 'drol:short')
        this.setDescription(longDescriptionInputValue, 'drol:long')

        this.xmlDoc = jxon.unbuild(location, null, 'conceptItem')
        var conceptItem = this.xmlDoc.documentElement.outerHTML

        switch (method) {
            case "PUT":
                return this.context.api.router.put(url, conceptItem)
            case "POST":
                return this.context.api.router.post(url, conceptItem)
        }

    }

    /**
     * When searchItem is clicked update the map by setting props on MapComponent
     * @param {class} googleLatLng
     */
    searchItemSelected(googleLatLng) {
        this.markerPositionChanged({lat: googleLatLng.lat(), lng: googleLatLng.lng()})
        this.refs.mapComponent.setProps({googleLatLng: googleLatLng})
    }


    /**
     * When Google maps is loaded in MapComponent pass the google instance to searchComponent
     * @param {class} google
     */
    googleMapsLoaded(google) {

        this.google = google


        if (this.state.newLocation && this.state.query) { // If there is a new location and there is a query entered show that in map
            try {
                this.refs.searchComponent.setProps({google: google, query: this.state.query})
            } catch (e) {
            }

        } else {
            this.refs.searchComponent.setProps({google: google})
        }

        this.extendState({
            googleMapsLoaded: true
        })


    }

    /**
     * Updates the marker on the map by setting props on MapComponent
     */
    updateMapPosition() {
        var latlng = this.getLatLngFromLoadedLocation()
        this.refs.mapComponent.setProps({googleLatLng: new this.google.maps.LatLng(latlng.lat, latlng.lng)})
    }

    updateMapPositionPolygon() {
        var wktPolygon = this.state.location.concept.metadata.object.data.geometry
        try {
            this.refs.mapComponent.setProps({isPolygon: true, wktString: wktPolygon})
        } catch (e) {
            console.error("e", e);
        }

    }

    /**
     * The lat and long from loaded location
     * @returns {{lat: *, lng: *}}
     */
    getLatLngFromLoadedLocation() {
        var geometry = findAttribute(this.state.location.concept, 'geometry')

        if (!geometry) {
            return {
                lat: 0,
                lng: 0
            }
        }

        var latLongString = /POINT\((\-?[0-9\.\s]+)\)/.exec(geometry)[1].split(' ')
        return {
            lat: latLongString[1],
            lng: latLongString[0]
        }
    }

    markerPositionChanged(latLng) {
        if (!this.state.location.concept.metadata.object.data) {
            this.state.location.concept.metadata.object.data = {}
        }
        this.state.location.concept.metadata.object.data.geometry = "POINT(" + latLng.lng + " " + latLng.lat + ")"
    }

    getDescription(descriptionType) {
        var locationConcept = this.state.location.concept
        if (!locationConcept.definition) {
            return undefined
        }

        if (isArray(locationConcept.definition)) {
            return find(locationConcept.definition, function (definition) {
                return definition['@role'] === descriptionType
            })
        } else if (isObject(locationConcept.definition)) {
            return locationConcept.definition['@role'] === descriptionType ? locationConcept.definition : undefined
        }

    }

    willReceiveProps(props) {
        this.extendState({
            query: props.query,
            newLocation: props.newLocation,
            location: props.location,
            editable: props.editable
        })
    }

    getNameForLocation() {
        if (this.state.query) {
            return this.state.query
        } else {
            return this.state.location.concept.name
        }
    }

    render($$) {

        let shortDesc = "",
            longDesc = ""

        const name = this.getNameForLocation()

        if (this.state.googleMapsLoaded) { // wait until google maps is loaded in MapCompontent
            shortDesc = this.getDescription('drol:short')
            longDesc = this.getDescription('drol:long')

            shortDesc = shortDesc ? shortDesc : ""
            longDesc = longDesc ? longDesc : ""

            if (this.state.location.concept.metadata.object['@type'] === 'x-im/polygon') {
                console.warn("Edit of polygons is not yet supported")
                this.searchDisabled = true
                this.isPolygon = true
                this.updateMapPositionPolygon()
            }
            else {
                this.updateMapPosition()
            }
        }
        const el = $$('div')

        const formContainer = $$('form').addClass('location-form__container clearfix').ref('formContainer').on('submit', (e) => {
            e.preventDefault()
            if (this.refs['locationNameInput'].val() !== "") {
                this.onClose('save')
            }
        })

        const hiddenSubmitButtonToEnableEnterSubmit = $$('input').attr({type: 'submit', style: 'display:none'})
        formContainer.append(hiddenSubmitButtonToEnableEnterSubmit)

        // Name
        const formGroup = $$('fieldset').addClass('form-group col-xs-6').ref('formGroupName')
        formGroup.append($$('label').attr('for', 'locationNameInput').append(this.getLabel('Name')))
        if (this.state.editable) {
            const locationName = $$('input').attr({
                type: 'text',
                id: 'locationNameInput'
            })
                .addClass('form-control').val(name)
                .ref('locationNameInput')

            locationName.on('change', function () {
                if (this.refs['locationNameInput'].val() === "") {
                    this.send("dialog:disablePrimaryBtn")
                } else {
                    this.send("dialog:enablePrimaryBtn")
                }
            }.bind(this))

            formGroup.append(locationName)
        }
        else {
            formGroup.append(
                $$('p').append(name).ref('locationNameP')
            )
        }
        formContainer.append(formGroup)


        // Short Desc
        const formGroupShortDesc = $$('fieldset').addClass('form-group col-xs-6').ref('formGroupShortDesc')
        formGroupShortDesc.append($$('label').attr('for', 'locationShortDescInput').append(this.getLabel('Short description')))
        if (this.state.editable) {
            formGroupShortDesc.append(
                $$('input').attr({
                    id: 'locationShortDescInput'
                })
                    .addClass('form-control')
                    .val(shortDesc['keyValue'])
                    .ref('locationShortDescInput')
            )
        }
        else {
            formGroupShortDesc.append(
                $$('p').append(shortDesc['keyValue']).ref('locationShortDescP')
            )
        }
        formContainer.append(formGroupShortDesc)

        // Long desc
        const formGroupLongDesc = $$('fieldset').addClass('form-group col-xs-12').ref('formGroupLongDesc')
        formGroupLongDesc.append($$('label').attr('for', 'locationLongDescText').append(this.getLabel('Long description')))
        if (this.state.editable) {
            formGroupLongDesc.append(
                $$('textarea').attr({
                    id: 'locationLongDescText'
                })
                    .addClass('form-control')
                    .val(longDesc['keyValue'])
                    .ref('locationLongDescText')
            )
        }
        else {
            formGroupLongDesc.append(
                $$('p').append(longDesc['keyValue']).ref('locationLongDescP')
            )
        }
        formContainer.append(formGroupLongDesc)


        el.append(formContainer)

        if (this.props.exists) {
            el.append($$('div').addClass('pad-top').append(
                $$('div').addClass('alert alert-info').append(this.getLabel("Please note that this name is already in use") + ": " + this.state.query)))
        }

        if (!this.searchDisabled) {
            const searchComponent = $$(SearchComponent).ref('searchComponent')
            el.append(searchComponent)
        }
        if (this.isPolygon) {
            el.append($$('p').addClass('col-xs-12 not-supported').append(this.getLabel('Edit of polygons is not currently supported')))
        }

        const mapComponent = $$(MapComponent, {pluginId: this.props.plugin.id}).ref('mapComponent')
        el.append(mapComponent)

        return el
    }

    onClose(status) {
        if ('cancel' === status || this.state.editable === false) {
            return true
        }

        if (this.state.newLocation) {
            this.createLocation()
        } else {
            this.updateLocation()
        }

        return false
    }

    getLocationType() {
        var useGeometryType = this.context.api.getConfigValue('se.infomaker.ximplace', 'useGeometryType')
        if (useGeometryType) {
            var locationType = ''
            try {
                if (typeof(this.state.location.concept.metadata.object['@type']) !== 'undefined') {
                    locationType = this.state.location.concept.metadata.object['@type']
                }
            }
            catch (ex) {
                console.error(ex)
                throw new Error('Invalid conceptItem for location')
            }

            if (locationType) {
                return locationType
            }
            else {
                throw new Error('Invalid conceptItem for location. Missing object type')
            }
        }
        else {
            return 'x-im/place'
        }
    }
}


function findAttribute(object, attribute) {
    var match

    function iterateObject(target, name) {
        Object.keys(target).forEach(function (key) {
            if (isObject(target[key])) {
                iterateObject(target[key], name)
            } else if (key === name) {
                match = target[key]
            }
        })
    }

    iterateObject(object, attribute)

    return match ? match : undefined
}


export default LocationDetailComponent
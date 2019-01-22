import {Component} from 'substance'
import {api, jxon, UIFormSearch} from 'writer'
import LocationListComponent from './LocationListComponent'
import LocationDetailComponent from './LocationDetailComponent'
import LocationTemplate from './template/concept'


class LocationMainComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'ximplace'
    }

    configureFeatures() {
        const features = api.getConfigValue(this.props.pluginConfigObject.id, 'features');

        switch (features) {
            case 'position':
                this.features = 'position';
                this.t = {
                    title: this.getLabel('Positions'),
                    placeholder: this.getLabel('Search positions')
                };
                break;

            case 'polygon':
                this.features = 'polygon';
                this.t = {
                    title: this.getLabel('Areas'),
                    placeholder: this.getLabel('Search areas')
                };
                break;

            default:
                this.features = 'all';
                this.t = {
                    title: this.getLabel('Locations'),
                    placeholder: this.getLabel('Search locations')
                };
        }


        this.polygonIsEditable = api.getConfigValue(
            this.props.pluginConfigObject.id,
            'polygon.editable',
            true
        )
    }


    getInitialState() {
        this.configureFeatures();
        return {
            existingLocations: api.newsItem.getLocations(this.features)
        }
    }

    reload() {
        this.setState({
            existingLocations: api.newsItem.getLocations(this.features)
        })
    }

    render($$) {
        const el = $$('div').addClass('location-main').append(
            $$('h2').append(
                this.t.title
            )
        )

        const locationList = $$(LocationListComponent, {
            locations: this.state.existingLocations,
            openMap: this.openMap.bind(this),
            removeLocation: this.removeLocation.bind(this)
        }).ref('locationList');

        let query = 'q=';
        if (this.features !== 'all') {
            query = 'f=' + this.features + '&q=';
        }

        const searchComponent = $$(UIFormSearch, {
            existingItems: this.state.existingLocations,
            searchUrl: '/api/search/concepts/locations?' + query,
            onSelect: this.addLocation.bind(this),
            onCreate: this.createMap.bind(this),
            createAllowed: (this.features !== 'polygon'),
            placeholderText: this.t.placeholder
        }).ref('authorSearchComponent');

        el.append(locationList);
        el.append(searchComponent);

        return el;
    }

    createMap(selectedItem, exists) {

        const parser = new DOMParser();
        const placeXML = parser.parseFromString(LocationTemplate.place, 'text/xml').firstChild
        const location = jxon.build(placeXML)


        const properties = {
            newLocation: true,
            exists: exists,
            query: selectedItem.inputValue,
            reload: this.reload.bind(this),
            editable: true,
            plugin: this.props.pluginConfigObject,
            location: location
        };

        api.ui.showDialog(LocationDetailComponent, properties, {
            title: this.getLabel('Place'),
            global: true,
            primary: this.getLabel('Save')
        })
    }

    addLocation(item) {
        // Use location "sub-type" as type for link
        const useGeometryType = api.getConfigValue(this.props.pluginConfigObject.id, 'useGeometryType');

        // Validate that writer config corresponds with concept backend config
        if (useGeometryType === true && !item.hasOwnProperty('geometryType')) {
            throw new Error('Writer configured to use geometry type for locations but no geometry type provided by concept backend');
        }

        const location = {
            title: item.name[0],
            uuid: item.uuid,
            data: item.location ? {position: item.location[0]} : {},
            type: useGeometryType ? item.geometryType[0] : 'x-im/place'
        };

        api.newsItem.addLocation(this.name, location)
        this.reload()
    }

    removeLocation(location) {
        api.newsItem.removeLinkByUUID(this.name, location.uuid);
        this.reload();
    }

    openMap(item) {
        let editable = true;
        if (item.concept.metadata.object['@type'] === 'x-im/polygon' && false === this.polygonIsEditable) {
            editable = false;
        }

        const properties = {
            newLocation: false,
            query: item.inputValue,
            location: item,
            reload: this.reload.bind(this),
            editable: editable,
            plugin: this.props.pluginConfigObject
        };

        api.ui.showDialog(LocationDetailComponent, properties, {
            title: this.getLabel('Place') + " " + item.concept.name,
            global: true,
            primary: editable ? this.getLabel('Save') : this.getLabel('Close'),
            secondary: editable ? this.getLabel('Cancel') : false

        })
    }

}

export default LocationMainComponent

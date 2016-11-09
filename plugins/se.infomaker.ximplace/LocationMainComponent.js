'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var AuthorSearchComponent = require('writer/components/form-search/FormSearchComponent');
var LocationDetailComponent = require('./LocationDetailComponent');
var LocationListComponent = require('./LocationListComponent');

function LocationMainComponent() {
    LocationMainComponent.super.apply(this, arguments);
    this.name = this.props.plugin.schema.name;
}

LocationMainComponent.Prototype = function () {

    this.configureFeatures = function() {
        var features = this.context.api.getConfigValue(this.props.plugin, 'features');

        switch(features) {
            case 'position':
                this.features = 'position';
                this.t = {
                    title: this.context.i18n.t('Positions'),
                    placeholder: this.context.i18n.t('Search positions')
                };
                break;

            case 'polygon':
                this.features = 'polygon';
                this.t = {
                    title: this.context.i18n.t('Areas'),
                    placeholder: this.context.i18n.t('Search areas')
                };
                break;

            default:
                this.features = 'all';
                this.t = {
                    title: this.context.i18n.t('Locations'),
                    placeholder: this.context.i18n.t('Search locations')
                };
        }


        this.polygonIsEditable = this.context.api.getConfigValue(
            this.props.plugin,
            'polygon.editable',
            true
        );
    };

    this.getInitialState = function () {
        this.configureFeatures();
        return {
            existingLocations: this.context.api.getLocations(this.features)
        };
    };

    this.reload = function () {
        this.setState({
            existingLocations: this.context.api.getLocations(this.features)
        });
    };

    this.render = function () {
        var el = $$('div').addClass('location-main').append(
            $$('h2').append(
                this.t.title
            )
        );

        var locationList = $$(LocationListComponent, {
            locations: this.state.existingLocations,
            openMap: this.openMap.bind(this),
            removeLocation: this.removeLocation.bind(this)
        }).ref('locationList');

        var query = 'q=';
        if (this.features != 'all') {
            query = 'f=' + this.features + '&q=';
        }

        var searchComponent = $$(AuthorSearchComponent, {
            existingItems: this.state.existingLocations,
            searchUrl: this.context.api.router.getEndpoint() + '/api/search/concepts/locations?' + query,
            onSelect: this.addLocation.bind(this),
            onCreate: this.createMap.bind(this),
            createAllowed: (this.features == 'polygon') ? false : true,
            placeholderText: this.t.placeholder
        }).ref('authorSearchComponent');

        el.append(locationList);
        el.append(searchComponent);

        return el;
    };

    this.createMap = function (selectedItem, exists) {
        var properties = {
            newLocation: true,
            exists: exists,
            query: selectedItem.inputValue,
            reload: this.reload.bind(this),
            editable: true,
            plugin: this.props.plugin
        };

        this.context.api.showDialog(LocationDetailComponent, properties, {
            title: this.context.i18n.t('Place'),
            global: true,
            primary: this.context.i18n.t('Save')
        });
    };

    this.addLocation = function (item) {
        // Use location "sub-type" as type for link
        var useGeometryType = this.context.api.getConfigValue(this.props.plugin, 'useGeometryType');

        // Validate that writer config corresponds with concept backend config
        if (useGeometryType === true && !item.hasOwnProperty('geometryType')) {
            throw new Error('Writer configured to use geometry type for locations but no geometry type provided by concept backend');
        }

        var location = {
            title: item.name[0],
            uuid: item.uuid,
            data: item.location ?  { position: item.location[0] } : {},
            type: useGeometryType ? item.geometryType[0] : 'x-im/place'
        };

        this.context.api.addLocation(this.name, location);
        this.reload();
    };

    this.removeLocation = function (location) {
        this.context.api.removeLinkByUUID(this.name, location.uuid);
        this.reload();
    };

    this.openMap = function (item) {
        var editable = true;
        if (item.concept.metadata.object['@type'] == 'x-im/polygon' && false === this.polygonIsEditable) {
            editable = false;
        }

        var properties = {
            newLocation: false,
            query: item.inputValue,
            location: item,
            reload: this.reload.bind(this),
            editable: editable,
            plugin: this.props.plugin
        };


        this.context.api.showDialog(LocationDetailComponent, properties, {
            title: this.context.i18n.t('Place') + " " + item.concept.name,
            global: true,
            primary: editable ? this.context.i18n.t('Save') : this.context.i18n.t('Close'),
            secondary: editable ? this.context.i18n.t('Cancel') : false
        });
    };
};

Component.extend(LocationMainComponent);
module.exports = LocationMainComponent;

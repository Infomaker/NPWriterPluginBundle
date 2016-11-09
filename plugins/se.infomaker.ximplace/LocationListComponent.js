'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var LocationItem = require('./LocationItemComponent');

function LocationListComponent() {
    LocationListComponent.super.apply(this, arguments);
    this.name = 'location';
}

LocationListComponent.Prototype = function() {

    this.render = function() {
        var el = $$('ul').addClass('tag-list').ref('locationItemList');

        var locations = this.props.locations.map(function(location) {
            return $$(LocationItem, {
                location: location,
                openMap: this.props.openMap.bind(this),
                removeLocation: this.props.removeLocation.bind(this)
            }).ref(location.uuid);
        }.bind(this));

        el.append(locations);
        return el;
    };


};

Component.extend(LocationListComponent);
module.exports = LocationListComponent;

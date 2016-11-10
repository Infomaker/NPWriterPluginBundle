import {Component} from 'substance'
//var LocationItem = require('./LocationItemComponent');
class LocationListComponent extends Component {
    constructor(...args) {
        super(...args)
    }

    render($$) {
        const el = $$('ul').addClass('tag-list').ref('locationItemList');

        const locations = this.props.locations.map((location) => {
            return $$('li').append(location.title)
            // return $$(LocationItem, {
            //     location: location,
            //     openMap: this.props.openMap.bind(this),
            //     removeLocation: this.props.removeLocation.bind(this)
            // }).ref(location.uuid);
        });

        el.append(locations);
        return el;
    }
}

export default LocationListComponent
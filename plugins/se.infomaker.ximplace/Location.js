'use strict';

function Location() {
}

Location.prototype.schema = {
    name: 'location',
    vendor: 'infomaker.se',

    uicomponents: {
        sidebar: {
            main: [
                require('./LocationMainComponent')
            ]
        }
    }
};

module.exports = Location;
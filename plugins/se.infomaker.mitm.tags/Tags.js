'use strict';

function Tags() {
}

Tags.prototype.schema = {
    name: 'tags',
    vendor: 'infomaker.se',

    uicomponents: {
        sidebar: {
            main: [
                require('./TagsMainComponent')
            ]
        }
    }
};

module.exports = Tags;
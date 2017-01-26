'use strict';

function Concept() {
}

Concept.prototype.schema = {
    name: 'conceptchannel',
    vendor: 'infomaker.se',

    uicomponents: {
        sidebar: {
            main: [
                require('./ConceptChannelMainComponent')
            ]
        }
    }
};

module.exports = Concept;
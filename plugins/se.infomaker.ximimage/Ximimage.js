const { BlockNode } = substance

class Ximimage extends BlockNode {}

Ximimage.define({
    type: 'ximimage',
    uuid: { type: 'string', optional: true },
    url: { type: 'string', optional: true },
    previewUrl: { type: 'string', optional: true },
    uri: { type: 'string', optional: true },

    progress: { type: 'number', default: 100 },
    knownData: { type: 'boolean', default: false },

    caption: { type: 'string', optional: true },
    alttext: { type: 'string', optional: true },
    credit: { type: 'string', optional: true },
    alignment: { type: 'string', optional: true },

    width: { type: 'number', optional: true },
    height: { type: 'number', optional: true },
    authors: { type: 'array', default: [] },

    crops: { type: 'object', default: [] }
})

module.exports = Ximimage

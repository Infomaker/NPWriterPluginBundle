const { BlockNode } = substance

class Ximteaser extends BlockNode {}

Ximteaser.define({
    type: 'ximteaser',
    uuid: {type: 'string', optional: true},
    dataType: {type: 'string', optional: false},
    title: {type: 'string', optional: false, default: '' },
    subject: {type: 'string', optional: false, default: '' },
    text: {type: 'string', optional: false, default: '' },
    imageType: {type: 'string', optional: true },
    uri: {type: 'string', optional: true },
    url: {type: 'string', optional: true},
    // ATTENTION: progress should not be part of the model
    // progress: {type: 'number', default: 100 },
    width: {type: 'number', optional: true },
    height: {type: 'number', optional: true },
    crops: { type: 'object', default: [] }
})

export default Ximteaser


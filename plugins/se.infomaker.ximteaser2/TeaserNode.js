import {BlockNode, DefaultDOMElement} from 'substance'
import {api} from 'writer'

class TeaserNode extends BlockNode {
}

TeaserNode.isResource = false
TeaserNode.define({

    type: 'ximteaser',
    dataType: {type: 'string', optional: false},
    imageFile: {type: 'file', optional: true},
    uuid: {type: 'string', optional: true},
    uri: {type: 'string', optional: true},
    label: {type: 'string', optional: false},
    title: {type: 'text', optional: false, default: ''},
    subject: {type: 'string', optional: false, default: ''},
    text: {type: 'string', optional: false, default: ''},

    width: {type: 'number', optional: true},
    height: {type: 'number', optional: true},
    crops: {type: 'object', default: []},
    disableAutomaticCrop: {type: 'boolean', optional: true, default: false}
})

export default TeaserNode

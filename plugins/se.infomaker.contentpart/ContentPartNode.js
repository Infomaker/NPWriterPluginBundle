import {Container} from 'substance'

class ContentPartNode extends Container {}

ContentPartNode.isResource = false

ContentPartNode.defineSchema({
    type: 'contentpart',
    id: { type: 'string', optional: true },
    fields: { type: 'object', default: {}},
    contentPartUri: { type: 'string', optional: true }
})

export default ContentPartNode

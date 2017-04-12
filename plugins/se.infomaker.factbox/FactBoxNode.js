import {BlockNode} from 'substance'

class FactBoxNode extends BlockNode {}

FactBoxNode.isResource = false

FactBoxNode.defineSchema({
    type: 'factbox',
    id: { type: 'string', optional: true },
    title: { type: 'string', optional: true },
    vignette: { type: 'string', optional: true }
})

export default FactBoxNode

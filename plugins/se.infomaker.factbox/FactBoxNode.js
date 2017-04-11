import {Container} from 'substance'

class FactBoxNode extends Container {}

FactBoxNode.isResource = false

FactBoxNode.defineSchema({
    type: 'factbox',
    id: { type: 'string', optional: true },
    title: { type: 'string', optional: true },
    vignette: { type: 'string', optional: true },
    inlineTextUri: { type: 'string', optional: true }
})

export default FactBoxNode

import {BlockNode} from 'substance'

class ContentRelationsNode extends BlockNode { }

ContentRelationsNode.define({
    type: 'contentrelations',
    uuid: { type: 'string', optional: true },
    label: { type: 'string', optional: true },
    products: {type: 'string', optional: true},
    dataType: 'string'
})

export default ContentRelationsNode
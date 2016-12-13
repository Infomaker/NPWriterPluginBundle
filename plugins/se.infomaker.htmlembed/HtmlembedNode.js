import {BlockNode} from 'substance'

class HtmlembedNode extends BlockNode {

}

HtmlembedNode.define({
    type: 'htmlembed',
    id: { type: 'string'},
    dataType: 'string',
    format: 'string',
    text: {type: 'string', optional: true}
})

export default HtmlembedNode


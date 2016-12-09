
import {BlockNode} from 'substance'

class HtmlembedNode extends BlockNode {

}

HtmlembedNode.define({
    id: {
        type: 'string'
    },
    dataType: 'string',
    contentType: 'string',
    format: 'string',
    text: {type: 'string', optional: true}
})

export default HtmlembedNode


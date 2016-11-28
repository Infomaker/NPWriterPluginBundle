import {DocumentNode} from 'substance'

class HeaderEditorNode extends DocumentNode {
}

HeaderEditorNode.type = 'headereditor'
HeaderEditorNode.define({
    "headline": "text",
    "dateline": "text",
    "leadin": "text"
})

export default HeaderEditorNode

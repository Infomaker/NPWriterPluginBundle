import { DocumentNode } from 'substance'

class PublishflowNode extends DocumentNode {}

PublishflowNode.type = 'publishflow'
PublishflowNode.singleton = true
PublishflowNode.schema = {
    pubStatus: 'text',
    pubStart: { type: 'text', optional: true},
    pubStop: { type: 'text', optional: true}
}

export default PublishflowNode

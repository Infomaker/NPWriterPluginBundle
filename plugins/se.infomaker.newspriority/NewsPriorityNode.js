import { DocumentNode } from 'substance'

class NewsPriorityNode extends DocumentNode {}

NewsPriorityNode.type = 'news-priority'

NewsPriorityNode.schema = {
    score: 'number',
    description: 'string',
    format: { type: 'string', default: 'lifetimecode'},
    duration: 'number',
    end: { type: 'string', optional: true }
}

export default NewsPriorityNode

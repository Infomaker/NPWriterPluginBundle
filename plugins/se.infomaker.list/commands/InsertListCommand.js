import { uuid } from 'substance'
import { WriterCommand } from 'writer'

class InsertListCommand extends WriterCommand {

    execute(params, context) { // eslint-disable-line
        const { editorSession } = params

        const listNode = {
            id: uuid('list'),
            type: 'list',
            items: [
                {
                    type: 'list-item',
                    level: 1
                }
            ]
        }

        editorSession.transaction((tx) => {
            tx.insertBlockNode(listNode)
        })
    }
}

export default InsertListCommand

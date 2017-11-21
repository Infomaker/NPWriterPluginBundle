import {WriterCommand} from 'writer'

class InsertTeaserArticleCommand extends WriterCommand {

    /**
     * Handles insertion of image in a teaser node. If the insert happens
     * at the same time as a transaction, that transaction needs to be supplied to
     * the command. If not, it can be omitted.
     *
     * @param params
     * @param context
     */
    execute(params, context) {
        if(params.tx) {
            this._handleInsert(params.tx, params)
        } else {
            context.editorSession.transaction((tx) => this._handleInsert(tx, params))
        }
    }

    _handleInsert(tx, params) {
        const activeTeaserNode = params.context.node

        const article = {
            title: params.data.uriData.name,
            uuid: params.data.uriData.uuid
        }

        if (!article.uuid) {
            throw new Error('Unsupported data. UUID must exist')
        }

        activeTeaserNode.addRelatedArticle(article, tx)
    }
}

export default InsertTeaserArticleCommand

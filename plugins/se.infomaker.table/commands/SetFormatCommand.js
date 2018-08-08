import TableCommand from './TableCommand'

class SetFormatCommand extends TableCommand {
    executeCommandOnTable(params, context) { // eslint-disable-line
        const {tableNode, cellNode} = params.commandState
        const {format} = this.config

        const [,col] = tableNode.getCellCoords(cellNode.id)

        const meta = tableNode.getMetaForCol(col)

        meta.format = format

        params.editorSession.transaction(tx => {
            tableNode.setMetaForCol(col, meta, tx)
        })
    }
}

export default SetFormatCommand

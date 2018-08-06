import TableCommand from './TableCommand'

class ToggleIndexCommand extends TableCommand {
    executeCommandOnTable(params, context) { // eslint-disable-line
        const {tableNode, cellNode} = params.commandState

        const [,col] = tableNode.getCellCoords(cellNode.id)
        const colId = col

        const meta = tableNode.getMetaForCol(colId)

        meta.index = !meta.index

        params.editorSession.transaction(tx => {
            tableNode.setMetaForCol(colId, meta, tx)
        })
    }
}

export default ToggleIndexCommand

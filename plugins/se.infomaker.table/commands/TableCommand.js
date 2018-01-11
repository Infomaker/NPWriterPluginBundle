import { Command } from 'substance'
import selectionIsInTable from '../util/selectionIsInTable'

/**
 * @typedef TableCommand.commandState
 * @property {boolean} disabled - True if the command is disabled
 * @property {TableNode} tableNode
 * @property {TableCellNode} cellNode
 * @property {number} selectedRow - Row index of the selected cell
 * @property {number} selectedCol - Column index of the selected cell
 * @property {number[]} rows - Indices of all rows contained in the selected area
 * @property {number[]} cols - Indices of all columns contained in the selected area
 */


 /**
 * @typedef TableCommand.config
 * @property {string} name - Name of the command
 * @property {string} commandGroup - Name of the command group the command belongs to
 * @property {boolean} requiresMultipleRows
 * @property {boolean} requiresMultipleCols
 * @property {boolean} disabledOnMultipleRows
 * @property {boolean} disabledOnMultipleCols
 * @property {boolean} disabledOnAreaSelection - If the command should be enabled when a table area is selected
 */



class TableCommand extends Command {

    execute(params, context) {
        if (params.commandState && !params.commandState.disabled) {
            const doc = context.editorSession.getDocument()
            const nodeId = params.selection.getNodeId()
            const node = doc.get(nodeId)

            if (!node) { return }

            let table = null
            if (node.type === 'table') {
                table = node
            } else if (node.type === 'table-cell') {
                table = node.table
            }

            if (!table) { return }
            this.executeCommandOnTable(table, params)
        }
    }

    /**
     * Our command is enabled on table nodes and inside table cells.
     * @returns {TableCommand.commandState}
     */
    getCommandState(params, context) { //eslint-disable-line
        // Command is disabled if selection is not in a table
        const inTable = selectionIsInTable(params.selection)
        if (!inTable) {
            return { disabled: true }
        }

        // now that we know we are in a table, extract the table node from the selection
        const doc = params.editorSession.getDocument()
        const {table, cell} = this._extractTableAndCellFromSelection(params.selection, doc)

        // Command is disabled if no table node is available
        if (!table) {
            return { disabled: true }
        }
        const commandState = this._extractTableData(table, cell)
        commandState.disabled = false
        commandState.showInContext = true

        if (this.config.requiresMultipleRows && commandState.rows.length <= 1) {
            commandState.disabled = true
            commandState.showInContext = false
        }

        if (this.config.disabledOnMultipleRows && commandState.rows.length > 1) {
            commandState.disabled = true
            commandState.showInContext = false
        }

        if (this.config.requiresMultipleCols && commandState.cols.length <= 1) {
            commandState.disabled = true
            commandState.showInContext = false
        }

        if (this.config.disabledOnMultipleCols && commandState.cols.length > 1) {
            commandState.disabled = true
            commandState.showInContext = false
        }
        if (!commandState.disabled && this.config.name === 'table-delete-row') {
            console.info('GETTING COMMAND STATE')
            console.info('\trows:', commandState.rows)
            console.info('\trow:', commandState.selectedRow)
            console.info('\tcols:', commandState.cols)
            console.info('\tcol:', commandState.selectedCol)
        }
        return commandState
    }

    executeCommandOnTable(table, params) { // eslint-disable-line
        throw new Error('executeCommandOnTable is abstract')
    }

    /**
     * Extracts a table node from the provided selection or null if no table in selection
     * @param {substance.Selection} sel - selection to look in
     * @param {substance.Document} doc - document of the selection
     */
    _extractTableAndCellFromSelection(sel, doc) {
        const nodeId = sel.getNodeId()
        const node = doc.get(nodeId)

        const result = {
            table: null,
            cell: null
        }

        if (!node) { return result }

        if (node.type === 'table') {
            result.table = node
        } else if (node.type === 'table-cell') {
            result.cell = node
            result.table = node.table
        }

        return result
    }

    _extractTableData(tableNode, cellNode) {

        const area = tableNode.getArea()

        let selectedRow = null
        let selectedCol = null
        const rows = []
        const cols = []

        // If area has a startCell we know that at least once cell is selected
        if (area.startCell) {
            // TODO: Extract selected cell
            // For now we assume the first cell is the selected cell

            if (cellNode) {
                const selectedCellCoords = tableNode.getCellCoords(cellNode.id)
                if (selectedCellCoords) {
                    [selectedRow, selectedCol] = selectedCellCoords
                }
            } else {
                const startCellCoords = tableNode.getCellCoords(area.startCell.id)
                if (startCellCoords) {
                    [selectedRow, selectedCol] = startCellCoords
                }
            }
            // Build area rows
            for (let row = area.top; row <= area.bottom; row++) {
                rows.push(row)
            }

            // Build area columns
            for (let col = area.left; col <= area.right; col++) {
                cols.push(col)
            }
        }

        return {
            tableNode,
            cellNode,
            selectedRow,
            selectedCol,
            rows,
            cols
        }
    }
}

export default TableCommand

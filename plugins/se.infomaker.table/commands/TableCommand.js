import { Command, Component } from 'substance'
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

    /**
     * All table commands should execute their commands through this method.
     *
     * The normal execute method should not be overwritten in commands that extend this class
     * as it handles a bug related to commandState and a selection bug.
     * @param {*} params - Command params
     * @param {*} context - Command context
     */
    executeCommandOnTable(params, context) { // eslint-disable-line
        throw new Error('executeCommandOnTable is abstract')
    }

    execute(params, context) {
        if (params.commandState && !params.commandState.disabled) {
            // Get commandState again to make sure we have the right selection
            // TODO: Look into why it's not updated correctly
            const commandState = this.getCommandState(params, context)
            params.commandState = commandState

            this.executeCommandOnTable(params, context)

            // To keep focus on the table after executing the command through the context menu
            this._refocusOnTable(commandState.tableNode)
        }
    }

    /**
     * Extract a cell component from the provided table node and set focus on it's
     * native element, effectively setting document.activeElement to the cell.
     *
     * This is needed to keep focus on the table after a command has been executed
     * through the context menu. Should be removed once a solution is found.
     * @param {*} sel
     */
    _refocusOnTable(tableNode) {
        if (!tableNode) { return console.info('No table node found') }

        const tableElem = document.querySelector(`[data-id=${tableNode.id}]`)
        if (!tableElem) { return console.info('No table element found') }

        const tableComp = Component.unwrap(tableElem)
        if (!tableComp) { return console.info('No table comp found') }

        const cellEditor = tableComp.find('td .sc-surface.sc-text-property-editor')
        if (!cellEditor) { return console.info('No cell editor found') }

        cellEditor.getNativeElement().focus()
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


        // Todo: remove when done debugging command state thing
        if (!commandState.disabled && (this.config.name === 'table-delete-row' || this.config.name === 'table-delete-rows')) {
            console.info('GETTING COMMAND STATE')
        }
        return commandState
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
        if (area && area.startCell) {
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

/**
 * Modified version of substance table node
 * https://github.com/substance/substance/blob/v1.0.0-beta.6.5/packages/table/Table.js
 */
import { BlockNode, uuid } from 'substance'
import { api } from 'writer'

class TableNode extends BlockNode {

    /**
     * @returns {number} Number of rows in the table
     */
    get rowCount() {
        return this.cells.length
    }

    /**
     * @returns {number} Number of columns in the table
     */
    get colCount() {
        if (this.cells.length > 0) {
            return this.cells[0].length
        } else {
            return 0
        }
    }

    /**
     * Get the zero-indexed coordinates of a cell, or null if no cell found
     * @param {string} cellId
     */
    getCellCoords(cellId) {
        for (let row = 0; row < this.rowCount; row++) {
            for (let col = 0; col < this.colCount; col++) {
                if (this.cells[row][col] === cellId) {
                    return [row, col]
                }
            }
        }
        return null
    }

    getCellAt(row, col) {
        if (!Array.isArray(this.cells[row])) { return }
        let cellId = this.cells[row][col]
        if (cellId) {
            return this.document.get(cellId)
        }
    }

    getCellById(cellId) {
        if (cellId) {
            return this.document.get(cellId)
        }
    }

    /**
     * Returns the owner of the cell at the provided coordinates
     *
     * Cells with null IDs are owned by a cell with either a rowspan or a colspan
     * @param {number} row
     * @param {number} col
     */
    getOwnerOfCellAt(row, col) {
        const startRow = row
        const startCol = col
        let stopRow = 0
        let stopCol = 0

        for (let _row = startRow; _row >= stopRow; _row--) {
            for (let _col = startCol; _col >= stopCol; _col--) {
                const cell = this.getCellAt(_row, _col)

                if (cell) {
                    let rowspan = cell.rowspan || 1
                    let colspan = cell.colspan || 1

                    if (_row + rowspan > startRow && _col + colspan > startCol) {
                        // If both colspan and rowspan match we have found the owner
                        return cell
                    } else {
                        // If either one doesnt match
                        console.info('\tFound cell but no match, setting stopCol to', stopCol)
                        stopCol = _col + colspan - 1
                    }
                }
            }
        }
    }

    /**
     * Return the next cell in the table
     *
     * Looks for a cell below the current cell. If no cell is found, continues to look for a cell
     * in the next column. Again, if no cell is found, it returns the first cell in the table
     *
     * @todo Add support for area constraint
     * @param {string} currentCellId - ID of the currently selected cell
     * @param {Boolean} horizontal - Set to true if the search method should be along the x axis
     * @returns {TableCellNode} The next cell node or the provided cell if no next cell found
     */
    getNextCell(currentCellId, horizontal=false, reverse=false, area=null) {
        const coords = this.getCellCoords(currentCellId)
        if (!coords) { return null }

        const cell = this.getNextCellAt(coords[0], coords[1], horizontal, reverse, area)
        if (cell) {
            return cell
        } else {
            console.warn('Could not find next cell for cell with id', currentCellId)
            return this.getCellAt(coords[0], coords[1])
        }
    }

    /**
     * @todo Rewrite this, could probably be simplified by using the Area class better
     * @param {*} row
     * @param {*} col
     * @param {*} horizontal
     * @param {*} reverse
     * @param {*} area
     */
    getNextCellAt(row, col, horizontal=false, reverse=false, area=null) {
        const mainAxis = horizontal ? col : row
        const secondaryAxis = horizontal ? row : col
        const mainAxisCount = horizontal ? this.colCount : this.rowCount
        const secondaryAxisCount = horizontal ? this.rowCount : this.colCount
        const maxRowIndex = this.rowCount - 1
        const maxColIndex = this.colCount - 1
        const shouldTryMainAxis = reverse ? mainAxis > 0 : mainAxis < mainAxisCount - 1
        const shouldTrySecondaryAxis = reverse ? secondaryAxis > 0 : secondaryAxis < secondaryAxisCount - 1

        if (shouldTryMainAxis) {
            reverse ? (horizontal ? col-- : row--) : (horizontal ? col++ : row++) //eslint-disable-line
        } else if (shouldTrySecondaryAxis) {
            reverse ? (horizontal ? col = maxColIndex : row = maxRowIndex) : (horizontal ? col = 0 : row = 0) //eslint-disable-line
            reverse ? (horizontal ? row-- : col--) : (horizontal ? row++ : col++) //eslint-disable-line
        } else {
            if (area) {
                const coords = reverse ? area.lastCellCoords.start : area.firstCellCoords.start
                return this.getCellAt(coords[0], coords[1])
            } else {
                return reverse ? this.getCellAt(maxRowIndex, maxColIndex) : this.getCellAt(0, 0)
            }
        }

        const cell = this.getCellAt(row, col)
        if (cell && (!area || (area && area.containsCellId(cell.id)))) {
            return cell
        } else {
            return this.getNextCellAt(row, col, horizontal, reverse, area)
        }
    }

    getArea() {
        return this.area
    }

    createEmptyCell(tx) {
        const emptyCell = tx.create({
            id: uuid('table-cell'),
            type: 'table-cell',
            parent: this.id,
            content: ''
        })

        return emptyCell.id
    }

    /**
     * Insert a row at the specified index.
     *
     * All rows after, and including, the insertion index will be shifted one column down.
     * If no transaction is provided it will be created.
     * @param {number} colIndex - Index to insert the row at
     * @param {Transaction} tx - The transaction to use for column creation
     */
    insertRowAt(rowIndex, tx) {
        if (rowIndex > this.rowCount) {
            return console.warn('rowIndex cannot be greater than rowCount')
        }

        if (!tx) {
            return api.editorSession.transaction(tx => this.insertRowAt(rowIndex, tx))
        }

        // Save a reference to the table node
        // `this` will refer to the table node as it is before the transaction.
        // Any changes in the transaction will not be reflected in `this`
        const tableNode = tx.get([this.id])

        // Create the new row
        const newRow = []
        for (let col = 0; col < tableNode.colCount; col++) {

            if (rowIndex === tableNode.rowCount) {
                // If inserting a row at the end we can't check the adjacent row
                newRow.push(tableNode.createEmptyCell(tx))
                continue
            }

            let colspan
            const adjacentRowCell = tableNode.getCellAt(rowIndex, col)

            if (adjacentRowCell) {
                colspan = adjacentRowCell.colspan || 1
            } else {
                const owner = tableNode.getOwnerOfCellAt(rowIndex, col)
                colspan = owner.colspan || 1

                // Increase rowspan of owner cell
                const newRowspan = owner.rowspan === 0 ? 2 : owner.rowspan + 1
                tx.set([owner.id, 'rowspan'], newRowspan)
            }

            // Create as many cells as the adjacent cells rowspan
            for (let i = 0; i < colspan; i++) {
                const newAddition = adjacentRowCell ? tableNode.createEmptyCell(tx) : null
                newRow.push(newAddition)
            }

            // Skip as many columns as created cells
            col += colspan - 1
        }

        const cells = tableNode.cells.slice()
        cells.splice(rowIndex, 0, newRow)
        tx.set([tableNode.id, 'cells'], cells)
    }

    deleteRowAt(rowIndex, tx) {
        console.info('\tDelete row at:', rowIndex)
        if (rowIndex < 0 || rowIndex >= this.rowCount) {
            return console.warn('Cannot delete a row that does not exist')
        }

        if (!tx) {
            return api.editorSession.transaction(tx => this.deleteRowAt(rowIndex, tx))
        }

        // Save a reference to the table node
        // `this` will refer to the table node as it is before the transaction.
        // Any changes in the transaction will not be reflected in `this`
        const tableNode = tx.get([this.id])

        for (let col = 0; col < tableNode.colCount; col++) {
            let colspan, rowspan
            const cell = tableNode.getCellAt(rowIndex, col)
            if (cell) {
                rowspan = cell.rowspan || 1
                colspan = cell.colspan || 1
                if (rowspan > 1) {
                    // If the cell has a rowspan it means that at least one null cell will be
                    // left behind if we simply delete it, so we create a new cell where that
                    // null cell would be and set its rowspan to one less than the deleted cells
                    // rowspan.
                    const newRowspan = rowspan === 2 ? 0 : rowspan - 1
                    tableNode.createCellAt(rowIndex + 1, col, newRowspan, colspan, tx)
                }
            } else {
                // No cell found. Find owner and reduce rowspan by 1
                const owner = tableNode.getOwnerOfCellAt(rowIndex, col)
                colspan = owner.colspan || 1
                rowspan = owner.rowspan || 1
                const newRowspan = rowspan === 2 ? 0 : rowspan - 1
                tx.set([owner.id, 'rowspan'], newRowspan)
            }

            col += colspan - 1
        }

        // Slice away the row
        const cells = tableNode.slice()
        cells.splice(rowIndex, 1)
        tx.set([tableNode.id, 'cells'], cells)
    }

    /**
     * Insert a column at the specified index.
     *
     * All columns after, and including, the insertion index will be shifted one column to the right.
     * If no transaction is provided it will be created.
     * @param {number} colIndex - Index to insert the column at
     * @param {Transaction} tx - The transaction to use for column creation
     */
    insertColAt(colIndex, tx) {
        if (colIndex > this.colCount) {
            return console.warn('colIndex cannot be greater than rowCount')
        }

        if (!tx) {
            return api.editorSession.transaction(tx => this.insertRowAt(colIndex, tx))
        }

        // Save a reference to the table node
        // `this` will refer to the table node as it is before the transaction.
        // Any changes in the transaction will not be reflected in `this`
        const tableNode = tx.get([this.id])


        // Create the new column
        const cells = []
        const nodeCells = tableNode.cells.slice()
        for (let row = 0; row < tableNode.rowCount; row++) {

            if (colIndex === tableNode.colCount) {
                // If inserting a col at the end we can't check the adjacent col
                const newAddition = tableNode.createEmptyCell(tx)
                const currentRowCells = nodeCells[row].slice()
                currentRowCells.push(newAddition)
                cells.push(currentRowCells)
                continue
            }

            let rowspan
            const adjacentColCell = tableNode.getCellAt(row, colIndex)

            if (adjacentColCell) {
                rowspan = adjacentColCell.rowspan || 1
            } else {
                const owner = tableNode.getOwnerOfCellAt(row, colIndex)
                rowspan = owner.rowspan || 1

                // Increase colspan of owner cell
                const newColspan = owner.colspan === 0 ? 2 : owner.colspan + 1
                tx.set([owner.id, 'colspan'], newColspan)
            }

            // Create as many cells as the adjacent cells rowspan
            for (let i = 0; i < rowspan; i++) {
                const newAddition = adjacentColCell ? tableNode.createEmptyCell(tx) : null
                const currentRowCells = nodeCells[row + i].slice()
                currentRowCells.splice(colIndex, 0, newAddition)
                cells.push(currentRowCells)
            }

            // Skip as many rows as created cells
            row += rowspan - 1
        }

        tx.set([tableNode.id, 'cells'], cells)
    }

    deleteColAt(colIndex, tx) {


        if (colIndex < 0 || colIndex >= this.colCount) {
            return console.warn('Cannot delete a row that does not exist')
        }

        if (!tx) {
            return api.editorSession.transaction(tx => this.deleteRowAt(colIndex, tx))
        }

        // Save a reference to the table node
        // `this` will refer to the table node as it is before the transaction.
        // Any changes in the transaction will not be reflected in `this`
        const tableNode = tx.get([this.id])

        const cells = []
        for (let row = 0; row < tableNode.rowCount; row++) {
            let colspan, rowspan
            const cell = tableNode.getCellAt(row, colIndex)
            if (cell) {
                rowspan = cell.rowspan || 1
                colspan = cell.colspan || 1
                if (colspan > 1) {
                    // If the cell has a rowspan it means that at least one null cell will be
                    // left behind if we simply delete it, so we create a new cell where that
                    // null cell would be and set its rowspan to one less than the deleted cells
                    // rowspan.
                    const newColspan = colspan === 2 ? 0 : colspan - 1
                    tableNode.createCellAt(row, colIndex + 1, rowspan, newColspan, tx)
                }
            } else {
                // No cell found. Find owner and reduce colspan by 1
                const owner = tableNode.getOwnerOfCellAt(row, colIndex)
                colspan = owner.colspan || 1
                rowspan = owner.rowspan || 1
                const newColspan = colspan === 2 ? 0 : colspan - 1
                tx.set([owner.id, 'colspan'], newColspan)
            }

            for (let i = 0; i < rowspan; i++) {
                const currentRowCells = tableNode.cells[row + i].slice()
                currentRowCells.splice(colIndex, 1)
                cells.push(currentRowCells)
            }

            row += rowspan - 1
        }

        tx.set([tableNode.id, 'cells'], cells)
    }

    createCellAt(row, col, rowspan=0, colspan=0, tx) {
        const cell = tx.create({
            id: uuid('table-cell'),
            type: 'table-cell',
            parent: this.id,
            content: '',
            rowspan: rowspan,
            colspan: colspan
        })

        this.cells[row][col] = cell.id
        tx.set([this.id, 'cells'], this.cells)
    }

    toggleHeader() {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'header'], !this.header)
        })
    }

    toggleFooter() {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'footer'], !this.footer)
        })
    }

}

TableNode.schema = {
    type: 'table',
    header: { type: 'boolean', default: false },
    footer: { type: 'boolean', default: false },
    caption: { type: 'string', default: '' },
    cells: {
        type: ['array', 'array', 'id'],
        default: [],
        owned: true
    },
    area: { type: 'object', optional: true }
}

export default TableNode

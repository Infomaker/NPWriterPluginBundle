/**
 * Modified version of substance table node
 * https://github.com/substance/substance/blob/v1.0.0-beta.6.5/packages/table/Table.js
 */
import { BlockNode } from 'substance'

class TableNode extends BlockNode {

    get rowCount() {
        return this.cells.length
    }

    get colCount() {
        if (this.cells.length > 0) {
            return this.cells[0].length
        } else {
            return 0
        }
    }

    getRowCount() {
        console.error('Deprecated, use node.rowCount instead')
        return this.rowCount
    }

    getColCount() {
        console.error('Deprecated, use node.colCount instead')
        return this.colCount
    }

    /**
     *
     * @param {*} cellId
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
        console.warn('Getting next cell at', row, col)
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

    toggleHeader() {
        this.header = !this.header
    }

    toggleFooter() {
        this.footer = !this.footer
    }

}

TableNode.schema = {
    type: 'table',
    header: { type: 'boolean', default: false },
    footer: { type: 'boolean', default: false },
    caption: { type: 'string', default: 'No caption' },
    cells: {
        type: ['array', 'array', 'id'],
        default: [],
        owned: true
    }
}

export default TableNode

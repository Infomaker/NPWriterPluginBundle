import {lodash} from 'writer'

/**
 * Helper class for working with table areas
 *
 * Definitions:
 * - coords: Array with zero-indexed coordinates, [row, col]
 * - cell/cellNode: Table cell node
 * - cellId: Cell node id in the form 'table-cell-{uuid}'
 * - startCell: Node of cell where the area starts, not necessarily the first cell
 * - endCell: Node of cell where the area ends, not necessarily the last cell
 * - firstCell: Top left cell
 * - lastCell: Bottom right cell
 */
class TableArea {
    constructor(tableNode, startCellNode, endCellNode) {
        this.table = tableNode
        this.startCell = startCellNode
        this.endCell = endCellNode

        this.top = null
        this.left = null
        this.bottom = null
        this.right = null
        this._searchCoords = []
        this._searchedCells = []
        this._searchReset = false

        if (this.startCell && this.endCell) {
            this._perimeterSearch()
        }
    }

    /**
     * Get cells contained in the area
     * @returns {string[]} Array of cell IDs contained in area
     */
    get cells() {
        const cells = []
        if (this.top === null || this.bottom === null) { return cells }
        for (let row = this.top; row <= this.bottom; row++) {
            for (let col = this.left; col <= this.right; col++) {
                const ownerCell = this.table.getOwnerOfCellAt(row, col)
                if (!cells.includes(ownerCell.id)) {
                    cells.push(ownerCell.id)
                }
            }
        }
        return cells
    }

    /**
     * Get the width of the area in number of cells along the x-axis
     * @returns {number} Width of the area
     */
    get width() {
        if (this.right === null || this.left === null) { return 0 }
        return this.right - this.left + 1
    }

    /**
     * Get the height of the area in number of cells in the y-axis
     * @returns {number} Height
     *  of the area
     */
    get height() {
        if (this.bottom === null || this.top === null) { return 0 }
        return this.bottom - this.top + 1
    }

    get firstCell() {
        return this.table.getOwnerOfCellAt(this.top, this.left)
    }

    get lastCell() {
        return this.table.getOwnerOfCellAt(this.bottom, this.right)
    }

    get firstCellId() {
        if (this.firstCell) {
            return this.firstCell.id
        }
    }

    get lastCellId() {
        return this.lastCell.id
    }

    get firstCellCoords() {
        return this._extractCellCoords(this.firstCell)
    }

    get lastCellCoords() {
        return this._extractCellCoords(this.lastCell)
    }

    _extractCellCoords(cellNode) {
        const coords = this.table.getCellCoords(cellNode.id)
        const endRow = cellNode.rowspan > 1 ? cellNode.rowspan - 1 + coords[0] : coords[0]
        const endCol = cellNode.colspan > 1 ? cellNode.colspan - 1 + coords[1] : coords[1]
        return {
            start: coords,
            end: [endRow, endCol]
        }
    }

    get firstRow() {
        throw new Error('Not implemented')
    }

    get lastRow() {
        throw new Error('Not implemented')
    }

    get firstCol() {
        throw new Error('Not implemented')
    }

    get lastCol() {
        throw new Error('Not implemented')
    }

    /**
     * @param {string} cellId
     * @returns {Boolean} true if the provided cell ID is contained in the area
     */
    containsCellId(cellId) {
        return this.cells.includes(cellId)
    }

    /**
     * @param {cellNode} cellNode
     * @returns {Boolean} true if the provided cell node is contained in the area
     */
    containsCell(cellNode) {
        return this.containsCellId(cellNode.id)
    }

    _perimeterSearch() {
        const startCellCoords = this.table.getCellCoords(this.startCell.id)
        const endCellCoords = this.table.getCellCoords(this.endCell.id)

        if (!startCellCoords && !endCellCoords) { return }

        // if the initial bounds are not set, use the start and end cells to figure them out
        this.top = this.top !== null ? this.top : Math.min(startCellCoords[0], endCellCoords[0])
        this.left = this.left !== null ? this.left : Math.min(startCellCoords[1], endCellCoords[1])
        this.bottom = this.bottom !== null ? this.bottom : Math.max(startCellCoords[0], endCellCoords[0])
        this.right = this.right !== null ? this.right : Math.max(startCellCoords[1], endCellCoords[1])

        this._setSearchCoords()

        for (let i = 0; i < this._searchCoords.length; i++) {
            if (this._searchReset) { break }

            const [row, col] = this._searchCoords[i]

            // If cell searched, continue to the next cell
            if (this._cellAlreadySearched(row, col)) {
                continue
            }

            // Now continue the search
            const cellNode = this.table.getCellAt(row, col)
            if (cellNode) {
                // If cell found, check for colspan and rowspan
                this._handleFoundCellNode(cellNode)

            } else {
                // If Null cell found, figure out what cell it belongs to
                const owner = this.table.getOwnerOfCellAt(row, col)
                this._handleFoundCellNode(owner)
            }
        }

        // If the search was reset, restart it
        if (this._searchReset) {
            this._searchReset = false
            return this._perimeterSearch()
        }
    }

    /**
     * Sets the search coordinates for all cells in the perimeter
     *
     * Creates a 2d array with all edge cells and removes all duplicates
     */
    _setSearchCoords() {
        // reset searchCoords
        this.searchCoords = []

        // Set left edge
        for (let row = this.top, col = this.left; row <= this.bottom; row++) {
            this._searchCoords.push([row, col])
        }

        // Set top edge
        for (let row = this.top, col = this.left; col <= this.right; col++) {
            this._searchCoords.push([row, col])
        }

        // Set bottom edge
        for (let row = this.bottom, col = this.left; col <= this.right; col++) {
            this._searchCoords.push([row, col])
        }

        // Set right edge
        for (let row = this.top, col = this.right; row <= this.bottom; row++) {
            this._searchCoords.push([row, col])
        }

        // Remove duplicate coords to avoid having to search them twice
        this._searchCoords = lodash.uniqWith(this._searchCoords, (arr, other) => {
            return arr[0] === other[0] && arr[1] === other[1]
        })
    }

    /**
     * Helper method to check if a cell coordinate has already been searched
     * @param {number} row
     * @param {number} col
     * @returns {boolean}
     * @private
     */
    _cellAlreadySearched(row, col) {
        if (this._searchedCells[row]) {
            return this._searchedCells[row][col]
        } else {
            return false
        }
    }

    /**
     * Helper method to marka cell coordinate as searched
     * @param {number} row
     * @param {number} col
     * @private
     */
    _markCellSearched(row, col) {
        if (!this._searchedCells[row]) {
            this._searchedCells[row] = []
        }
        this._searchedCells[row][col] = true
    }

    _handleFoundCellNode(cellNode) {
        const cellCoords = this.table.getCellCoords(cellNode.id)
        this._markCellSearched(cellCoords[0], cellCoords[1])

        if (cellNode.rowspan > 1) {
            const cellBottom = cellCoords[0] + cellNode.rowspan - 1
            const cellTop = cellCoords[0]

            // Mark the cell and it's rowspan as searched
            for (let row = cellCoords[0]; row <= cellBottom; row++) {
                this._markCellSearched(row, cellCoords[1])
            }

            // If the bottom edge of the cell is outside the area, increase the area
            // Also mark search as reset to search again
            if (cellBottom > this.bottom) {
                this.bottom = cellBottom
                this._searchReset = true
            }

            // If the top edge of the cell is outside the area, increase the area
            // Also mark search as reset to search again
            if (cellTop < this.top) {
                this.top = cellTop
                this._searchReset = true
            }
        }

        if (cellNode.colspan > 1) {
            const cellRight = cellCoords[1] + cellNode.colspan - 1
            const cellLeft = cellCoords[1]
            // Mark the cell and it's colspan as searched
            for (let col = cellCoords[1]; col <= cellRight; col++) {
                this._markCellSearched(cellCoords[0], col)
            }

            // If the right edge of the cell is outside the area, increase the area
            // Also mark search as reset to search again
            if (cellRight > this.right) {
                this.right = cellRight
                this._searchReset = true
            }

            // If the left edge of the cell is outside the area, increase the area
            // Also mark search as reset to search again
            if (cellLeft < this.left) {
                this.left = cellLeft
                this._searchReset = true
            }
        }
    }

}

export default TableArea

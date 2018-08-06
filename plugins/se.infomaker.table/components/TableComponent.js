import '../scss/table.scss'
import {Component} from 'substance'
import TableCellComponent from './TableCellComponent'
import TableSelectionComponent from './TableSelectionComponent'
import extractCellComponentFromElement from '../util/extractCellComponentFromElement'
import {keys, isInputKey} from '../util/keys'

/**
 * @typedef TableComponent.Props
 * @property {TableNode} node - Reference to the TableNode
 */

/**
 * @typedef TableComponent.State
 * @property {?string} selectedCell - ID of the cell that is currently selected
 * @property {?string} focusedCell - ID of the cell that is currently focused
 */

/**
 * Renders an editable HTML table that can be used in an isolated node or dialog
 *
 * @class TableComponent
 * @extends {Component}
 * @param {TableComponent.Props} props
 * @property {TableComponent.Props} props
 * @property {TableComponent.State} state
 */
class TableComponent extends Component {
    constructor(...args) {
        super(...args)
        this.onSelectionStart = this.onSelectionStart.bind(this)
        this.onSelection = this.onSelection.bind(this)
        this.onSelectionEnd = this.onSelectionEnd.bind(this)
    }

    /**
     * @returns {TableComponent.State}
     */
    getInitialState() {
        return {
            selectedCell: null,
            focusedCell: null,
        }
    }

    /**
     * Hacky way to trigger an update of command states which has to be done after setting
     * the area selection. Find a better way to do this.
     */
    __retriggerCommandStates__() {
        // console.warn('Dont do this, find a better way to retrigger getting command states')
        this.context.editorSession.setSelection(this.context.editorSession.getSelection())
    }

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    _onDocumentChange(change) {
        if (change.isAffected([this.props.node.id])) {
            this.rerender()
        }
    }

    shouldRerender(newProps, newState) {
        const headerToggled = this.props.node.header !== newProps.node.header
        const footerToggled = this.props.node.footer !== newProps.node.footer
        const selectedCellChanged = this.state.selectedCell !== newState.selectedCell
        const focusedCellChanged = this.state.focusedCell !== newState.focusedCell
        return selectedCellChanged || focusedCellChanged || headerToggled || footerToggled
    }

    render($$) {
        const node = this.props.node
        const rowCount = node.rowCount
        const colCount = node.colCount

        const el = $$('div', {class: 'table-container'}).ref('container')

        const tableElem = $$('table', {class: ''}).ref('table')
        const theadElem = $$('thead', {class: ''}).ref('table-head')
        const tbodyElem = $$('tbody', {class: ''}).ref('table-body')
        const tfootElem = $$('tfoot', {class: ''}).ref('table-foot')

        const selectionElem = $$(TableSelectionComponent, {
            container: this.refs.container,
            node: node,
            debug: false
        }).ref('selection')

        for (let row = 0; row < rowCount; row++) {
            const rowElem = $$('tr').ref(`table-row-${row}`)

            for (let col = 0; col < colCount; col++) {
                const cellNode = node.getCellAt(row, col)
                if (cellNode) {
                    const cellElem = $$(TableCellComponent, {
                        node: cellNode,
                        disabled: this.props.disabled,
                        header: this.isHeaderRow(row),
                        selectionState: this._getSelectionStateForCell(cellNode.id),
                        meta: this.isHeaderRow(row) ? node.getMetaForCol(col) : {}
                    }).ref(cellNode.id)
                    rowElem.append(cellElem)
                }
            }

            if (this.isHeaderRow(row)) {
                theadElem.append(rowElem)
            } else if (this.isFooterRow(row)) {
                tfootElem.append(rowElem)
            } else {
                tbodyElem.append(rowElem)
            }
        }

        tableElem.on('mousedown', this.onClick.bind(this), true)
        tableElem.on('dblclick', this.onDblClick.bind(this), false)
        tableElem.on('keydown', this.onKeyDown.bind(this))
        tableElem.on('paste', this.onPaste.bind(this))

        tableElem.append([theadElem, tbodyElem, tfootElem])

        return el.append([tableElem, selectionElem])
    }

    _getSelectionStateForCell(cellId) {
        if (this.state.focusedCell === cellId) { return 'focused' }
        if (this.state.selectedCell === cellId) { return 'selected' }
        return null
    }

    onClick(event) {
        this.grabFocus()

        const leftClick = event.which === 1
        const shiftClick = event.shiftKey

        let cellComp = extractCellComponentFromElement(event.target)
        if (cellComp) {
            const cellId = cellComp.props.node.id
            if(cellId !== this.state.focusedCell) {
                event.stopPropagation()
                event.preventDefault()
                if (leftClick) {
                    // Focusing on the cell temporarily enables it, allowing a selection to be set
                    // inside it's editor
                    if(cellId !== this.state.selectedCell) {
                        this.setCellFocused(cellComp)
                    }
                    this.setCellSelected(cellComp)

                    if (shiftClick) {
                        this.onSelection(event)
                        this.onSelectionEnd(event)
                    } else {
                        // Start area selection
                        this.onSelectionStart(event)
                    }
                }
            }
        } else {
            this.resetSelection()
        }
    }

    onDblClick(event) {
        event.stopPropagation()
        event.preventDefault()

        let cellComp = extractCellComponentFromElement(event.target)
        if (cellComp) {
            this.setCellFocused(cellComp)
        }
    }

    onPaste(event) {
        if (event && event.clipboardData) {
            const pastedText = event.clipboardData.getData('text')
            let colCount = 0
            const pastedCells = pastedText.split('\n').map(row => {
                const rowCells = row.split('\t')
                colCount = Math.max(colCount, rowCells.length)
                return rowCells
            })
            let rowCount = pastedCells.length

            if (rowCount > 1 || colCount > 1) {
                event.preventDefault()
                event.stopPropagation()
                this._handlePastedContent(pastedCells)
            }
        }
    }

    /**
     * Inserts pasted table data into the selected area
     * @param {Array.<string[]>} pastedCells - The pasted content
     */
    _handlePastedContent(pastedCells) {
        const node = this.props.node
        const sel = this.refs.selection
        const area = sel.getArea()

        const selectedCoords = node.getCellCoords(this.state.selectedCell)

        const startRow = area ? area.top : selectedCoords[0]
        const startCol = area ? area.left : selectedCoords[1]

        const maxRow = area ? area.bottom : node.rowCount - 1
        const maxCol = area ? area.right : node.colCount - 1

        this.context.editorSession.transaction(tx => {
            pastedCells.forEach((row, pastedRowIndex) => {
                const rowIndex = startRow + pastedRowIndex
                if (rowIndex <= maxRow) {
                    row.forEach((pastedCell, pastedColIndex) => {
                        const colIndex = startCol + pastedColIndex
                        if (colIndex <= maxCol) {
                            const cellId = node.cells[rowIndex][colIndex]
                            if (cellId) {
                                tx.set([cellId, 'content'], String(pastedCell))
                            }
                        }
                    })
                }
            })
        })
    }

    /**
     * Select the cell the mouse is over and sets it as startCell
     *
     * Run when clicking a cell. Adds event listeners to handle area selection.
     * @param {MouseEvent} event
     */
    onSelectionStart(event) { // eslint-disable-line
        const selectedCell = this.refs[this.state.selectedCell]

        this.refs.selection.clear()
        this.refs.selection.setStartCell(selectedCell)

        const container = this.refs.container.getNativeElement()
        document.addEventListener('mouseup', this.onSelectionEnd)
        container.addEventListener('mousemove', this.onSelection)
    }

    /**
     * Select the cell the mouse is over
     *
     * Run during selection on mousemove. Finds the cell the user is hovering over and
     * sets it as endCell.
     * @param {MouseEvent} event
     */
    onSelection(event) {
        const targetCell = extractCellComponentFromElement(event.target)
        if (targetCell) {
            this.refs.selection.setEndCell(targetCell)
        }
    }

    onSelectionEnd(event) { // eslint-disable-line
        this.refs.selection.onSelectionEnd()
        const container = this.refs.container.getNativeElement()
        document.removeEventListener('mouseup', this.onSelectionEnd)
        container.removeEventListener('mousemove', this.onSelection)
        this.__retriggerCommandStates__()
    }

    /**
     * Delegates key events to the appropriate methods
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        switch (event.key) {
            // Cursor movements
            case keys.LEFT:
            case keys.RIGHT:
            case keys.UP:
            case keys.DOWN:
                return this._handleMovementKeys(event)
            // Input
            case keys.ENTER:
                return this._handleEnterKey(event)
            case keys.ESCAPE:
                return this._handleEscKey(event)
            case keys.TAB:
                return this._handleTabKey(event)
            case keys.DELETE:
                return this._handleDeleteKey(event)
            default:
                return this._handleInputKey(event)
        }
    }

    /**
     * Handles movement keys
     * @param {KeyboardEvent} event
     */
    _handleMovementKeys(event) {
        event.preventDefault()
        const node = this.props.node
        const sel = this.refs.selection
        // If shift key is pressed, area should be moved
        const moveArea = event.shiftKey
        let currentCellId = this.state.selectedCell || node.getCellAt(0, 0).id

        if (moveArea && sel.state.endCell) {
            currentCellId = sel.state.endCell.props.node.id
        }

        let coords = node.getCellCoords(currentCellId)

        if (!coords) {
            coords = node.getCellCoords(node.getCellAt(0, 0).id)
        }

        const shouldMoveUp = event.key === keys.UP && coords[0] > 0
        const shouldMoveRight = event.key === keys.RIGHT && coords[1] < node.colCount - 1
        const shouldMoveDown = event.key === keys.DOWN && coords[0] < node.rowCount - 1
        const shouldMoveLeft = event.key === keys.LEFT && coords[1] > 0

        const reverse = shouldMoveUp || shouldMoveLeft
        const horizontal = shouldMoveRight || shouldMoveLeft
        const move = shouldMoveUp || shouldMoveRight || shouldMoveDown || shouldMoveLeft

        // Area selection should be cleared when movement keys are used without shift
        if (!moveArea) { sel.clear() }

        if (move) {
            // Bug here. Next cell, when null, skips a row.
            // This should increase the area by one, not increase it to the next cell
            const nextCellId = node.getNextCellAt(coords[0], coords[1], horizontal, reverse).id
            if (nextCellId) {
                let nextCell = this.refs[nextCellId]
                if (moveArea) {
                    if (!sel.state.startCell) {
                        sel.setStartCell(this.refs[currentCellId])
                    }
                    sel.setEndCell(nextCell)
                    this.__retriggerCommandStates__()
                } else {
                    sel.clearArea()
                    this.setCellSelected(nextCell)
                }
            }
        }
    }

    /**
     * When the enter key is pressed
     *
     * If a single cell is selected:
     *  - Move to the next cell on the y-axis
     *  - Reverse if shift is pressed
     *
     * If multiple cells are selected:
     *  - Move to the next cell in the area on the y-axis
     *  - Reverse if shift is pressed
     * @param {KeyboardEvent} event
     */
    _handleEnterKey(event) {
        event.preventDefault()
        event.stopPropagation()

        const sel = this.refs.selection

        if (!this.state.focusedCell && !sel.hasArea()) {
            this.setCellFocused(this.refs[this.state.selectedCell])
        } else {
            const area = sel.getArea()
            const reversed = event.shiftKey
            const nextCell = this.props.node.getNextCell(this.state.selectedCell, false, reversed, area)
            if (!sel.hasArea()) { sel.clear() }
            this.setCellSelected(this.refs[nextCell.id])
        }
    }

    /**
     * When the tab key is pressed
     *
     * If a single cell is selected:
     *  - Move to the next cell on the x-axis
     *  - Reverse if shift is pressed
     *
     * If multiple cells are selected:
     *  - Move to the next cell in the area on the x-axis
     *  - Add a new row if on the last cell
     *  - Reverse if shift is pressed
     * @param {KeyboardEvent} event
     */
    _handleTabKey(event) {
        event.preventDefault()
        event.stopPropagation()

        const node = this.props.node
        const sel = this.refs.selection
        const area = sel.getArea()
        const reversed = event.shiftKey
        let nextCell = node.getNextCell(this.state.selectedCell, true, reversed, area)

        // Insert row if tab is pressed on last cell
        if (!sel.hasArea() && !reversed) {
            const lastRowDecrease = 1
            // const lastRowDecrease = node.footer ? 2 : 1 // If footer enabled, add row before the footer
            const lastCell = node.getOwnerOfCellAt(node.rowCount - lastRowDecrease, node.colCount - 1)
            if (this.state.selectedCell === lastCell.id) {
                node.insertRowAt(node.rowCount - (lastRowDecrease - 1))
                nextCell = node.getNextCell(this.state.selectedCell, true, reversed, area)
            }
            sel.clear()
        }

        this.setCellSelected(this.refs[nextCell.id])
    }

    /**
     * Escapes for a focused cell. If no cell is focused, exit from the isolated node.
     * @todo Should this revert the changes? If so, how could that be done?
     * @param {KeyboardEvent} event
     */
    _handleEscKey(event) {
        if (this.state.focusedCell) {
            event.preventDefault()
            event.stopPropagation()
            this.setCellSelected(this.refs[this.state.focusedCell])
        }
    }

    /**
     * Handles delete key
     *
     * Pressing delete on a table will clear the content of all cells in the selected area
     * @param {KeyboardEvent} event
     */
    _handleDeleteKey(event) {
        event.preventDefault()
        event.stopPropagation()

        const sel = this.refs.selection
        const area = sel.getArea()

        const cells = area ? area.cells : [this.state.selectedCell]

        this.context.editorSession.transaction(tx => {
            cells.forEach(cellId => {
                const doc = tx.getDocument()
                doc.setText([cellId, 'content'], '', []) // This will properly delete annotations too
            })
        })
    }

    _handleInputKey(event) {
        if (isInputKey(event.key)) {
            // When the meta or ctrl key is pressed we assume a command is being run
            // We should find a better way to figure out if a key combination produces
            // output or not. If it does not produce output, we don't want to set the
            // cell focused.
            if (event.metaKey || event.ctrlKey) {
                return
            }

            // If we have a selected cell but no focused cell, focus on the selected cell
            // and pass down the input
            if (!this.state.focusedCell && this.state.selectedCell) {
                this.setCellFocused(this.refs[this.state.selectedCell], true)
            }
        }
    }

    setCellSelected(cellComp) {
        const cellId = cellComp.props.node.id
        if (this.state.selectedCell !== cellId || this.state.focusedCell === cellId) {
            this.extendState({
                selectedCell: cellId,
                focusedCell: null
            })
            this.refs.selection.selectCell(cellComp)
            cellComp.grabFocus()
        }
    }

    setCellFocused(cellComp, selectContents=false) {
        const cellId = cellComp.props.node.id
        if (this.state.focusedCell !== cellId) {
            this.extendState({
                selectedCell: cellId,
                focusedCell: cellId
            })
            cellComp.grabFocus(selectContents)
        }
    }

    isHeaderRow(rowIndex) {
        const node = this.props.node
        return node.header && rowIndex === 0
    }

    isFooterRow(rowIndex) {
        const node = this.props.node
        return node.footer && rowIndex === node.rowCount - 1
    }

    grabFocus(selectCell=false) {
        if (!this.state.selectedCell && !this.state.focusedCell) {
            const firstCellId = this.props.node.getCellAt(0, 0).id
            this.setCellFocused(this.refs[firstCellId])
            this.setCellSelected(this.refs[firstCellId])
        } else if (this.state.selectedCell && selectCell) {
            this.setCellFocused(this.refs[this.state.selectedCell])
            this.setCellSelected(this.refs[this.state.selectedCell])
        }
    }

    resetSelection() {
        this.extendState(this.getInitialState())
        this.refs.selection.clear()
    }
}

export default TableComponent

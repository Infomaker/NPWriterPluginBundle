import '../scss/table.scss'
import {Component} from 'substance'
import TableCellComponent from './TableCellComponent'
import TableSelectionComponent from './TableSelectionComponent'
import extractCellComponentFromEventTarget from '../util/extractCellComponentFromEventTarget'
import {keys, isInputKey} from '../util/keys'

class TableComponent extends Component {

    constructor(...args) {
        super(...args)
        this.onSelectionStart = this.onSelectionStart.bind(this)
        this.onSelection = this.onSelection.bind(this)
        this.onSelectionEnd = this.onSelectionEnd.bind(this)
    }

    /**
     * Hacky way to trigger an update of command states which has to be done after setting
     * the area selection. Find a better way to do this.
     */
    __retriggerCommandStates__() {
        console.warn('Dont do this')
        this.context.editorSession.setSelection(this.context.editorSession.getSelection())
    }

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    _onDocumentChange(change) {
        if (change.isAffected([this.props.node.id])) {
            console.info('Change affected table node')
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

    getInitialState() {
        return {
            selectedCell: null,
            focusedCell: null,
        }
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
                        selectionState: this.getSelectionStateForCell(cellNode.id)
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

        tableElem.on('mousedown', this.onClick.bind(this))
        tableElem.on('dblclick', this.onDblClick.bind(this))

        tableElem.on('keydown', this.onKeyDown.bind(this))

        tableElem.append([theadElem, tbodyElem, tfootElem])

        return el.append([tableElem, selectionElem])
    }

    getSelectionStateForCell(cellId) {
        if (this.state.focusedCell === cellId) { return 'focused' }
        if (this.state.selectedCell === cellId) { return 'selected' }
        return null
    }

    onClick(event) {
        this.grabFocus()

        const leftClick = event.which === 1
        const rightClick = event.which === 3

        let cellComp = extractCellComponentFromEventTarget(event.target)
        if (cellComp) {
            const sel = this.refs.selection
            const cellId = cellComp.props.node.id
            if(cellId !== this.state.focusedCell) {
                event.stopPropagation()
                event.preventDefault()
                if (leftClick) {
                    this.setCellSelected(cellComp)
                    this.onSelectionStart(event)
                } else if (rightClick) {
                    if (sel.hasArea() && !sel.area.containsCellId(cellId) || !sel.hasArea()) {
                        this.setCellSelected(cellComp)
                        this.onSelectionStart(event)
                    }
                }
            }
        } else {
            // If right click is outside not on a cell, the selection is reset
            this.resetSelection()
            console.info('Single click, found no cell')
        }
    }

    onSelectionStart(event) { // eslint-disable-line
        const selectedCell = this.refs[this.state.selectedCell]

        this.refs.selection.clear()
        this.refs.selection.setStartCell(selectedCell)

        const container = this.refs.container.getNativeElement()
        document.addEventListener('mouseup', this.onSelectionEnd)
        container.addEventListener('mousemove', this.onSelection)
    }

    onSelection(event) { // eslint-disable-line
        const targetCell = extractCellComponentFromEventTarget(event.target)
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

    onDblClick(event) {
        event.stopPropagation()
        event.preventDefault()

        let cellComp = extractCellComponentFromEventTarget(event.target)
        if (cellComp) {
            this.setCellFocused(cellComp)
        }
    }

    onKeyDown(event) {
        switch (event.key) {
            // Cursor movements
            case keys.LEFT:
            case keys.RIGHT:
            case keys.UP:
            case keys.DOWN:
                return this._handleMovementKeys(event)
            // Input (together with text-input)
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
     * Handles arrow keys
     * @param {KeyboardEvent} event 
     */
    _handleMovementKeys(event) {
        event.preventDefault()
        const node = this.props.node
        const sel = this.refs.selection
        // If shift key is pressed, area should be moved
        const moveArea = event.shiftKey
        let currentCellId = this.state.selectedCell

        if (moveArea && sel.state.endCell) {
            currentCellId = sel.state.endCell.props.node.id
        }

        const coords = node.getCellCoords(currentCellId)

        const shouldMoveUp = event.key === keys.UP && coords[0] > 0
        const shouldMoveRight = event.key === keys.RIGHT && coords[1] < node.colCount - 1
        const shouldMoveDown = event.key === keys.DOWN && coords[0] < node.rowCount - 1
        const shouldMoveLeft = event.key === keys.LEFT && coords[1] > 0

        const reverse = shouldMoveUp || shouldMoveLeft
        const horizontal = shouldMoveRight || shouldMoveLeft
        const move = shouldMoveUp || shouldMoveRight || shouldMoveDown || shouldMoveLeft

        if (!moveArea) {
            // Area selection should be cleared when movement keys are used without shift
            sel.clear()
        }


        if (move) {
            // Bug here. Next cell when null skips a row.
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
     * When the enter key is pressed, if the cell is focused, select the next
     * cell along the y-axis, else, set the cell as focused.
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
     * When the tab key is pressed, select the next cell on the x-axis.
     * @param {KeyboardEvent} event
     */
    _handleTabKey(event) {
        console.info('Tab pressed on cell')
        event.preventDefault()
        event.stopPropagation()

        const node = this.props.node
        const sel = this.refs.selection
        const area = sel.getArea()
        const reversed = event.shiftKey
        let nextCell = node.getNextCell(this.state.selectedCell, true, reversed, area)

        // Insert row if tab is pressed on last cell
        if (!sel.hasArea() && !reversed) {
            const lastCell = node.getOwnerOfCellAt(node.rowCount - 1, node.colCount - 1)
            if (this.state.selectedCell === lastCell.id) {
                console.info('Trying to insert row')
                node.insertRowAt(node.rowCount)
                nextCell = node.getNextCell(this.state.selectedCell, true, reversed, area)
            }
            sel.clear()
        }

        this.setCellSelected(this.refs[nextCell.id])
    }

    /**
     * Escapes for a focused cell. If no cell is focused, exit from the isolated node.
     * @todo should this revert the changes?
     * @param {KeyboardEvent} event
     */
    _handleEscKey(event) {
        console.info('Esc pressed on cell')
        if (this.state.focusedCell) {
            event.preventDefault()
            event.stopPropagation()
            this.setCellSelected(this.refs[this.state.focusedCell])
        }
    }

    /**
     * @todo Delete should delete the contents of the cell if the cell is selected
     * @param {KeyboardEvent} event
     */
    _handleDeleteKey(event) {
        console.info('Delete pressed on cell')
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
            if (event.metaKey || event.ctrlKey || event.altKey) {
                console.info('Command running')
                return
            }

            console.info('Handling input key:', event.key)
            // If we have a selected cell but no focused cell, focus on the selected cell
            // and pass down the input
            if (!this.state.focusedCell && this.state.selectedCell) {
                console.info('Key input on selected cell')
                this.setCellFocused(this.refs[this.state.selectedCell], true)
            }
        } else {
            console.info('Not an input key', event.key)
        }
    }

    setCellSelected(cellComp) {
        const cellId = cellComp.props.node.id
        if (this.state.selectedCell !== cellId || this.state.focusedCell === cellId) {
            console.info('Setting cell selected')
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
        } else {
            if (this.state.selectedCell && selectCell) {
                console.info('Already has selected cell, selecting it again for good measure', this.state.selectedCell)
                this.setCellFocused(this.refs[this.state.selectedCell])
                this.setCellSelected(this.refs[this.state.selectedCell])
            } else {
                console.info('Maybe now?')
            }
        }

        // const isolatedNode = this.context.isolatedNodeComponent
        // if (isolatedNode) {
        //     isolatedNode.grabFocus()
        // }
    }

    resetSelection() {
        this.extendState(this.getInitialState())
        this.refs.selection.clear()
    }
}

export default TableComponent

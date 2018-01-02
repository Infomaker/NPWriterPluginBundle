import {Component} from 'substance'
import TableArea from '../util/TableArea'

class TableSelectionComponent extends Component {

    didMount() {
        document.addEventListener('selectionchange', () => {
            this.positionSelection()
        })
    }

    didUpdate() {
        this.area = new TableArea(this.props.node, this.state.startCell, this.state.endCell)
        window.area = this.area
        this.positionSelection()
    }

    getInitialState() {
        return {
            startCell: null,
            endCell: null,
            selectedCell: null,
        }
    }

    hasArea() {
        const hasStartAndEndCells = this.state.startCell && this.state.endCell
        const startAndEndCellsDiffer = this.state.startCell !== this.state.endCell
        return hasStartAndEndCells && startAndEndCellsDiffer
    }

    getArea() {
        if (this.hasArea()) {
            return this.area
        }
        return null
    }

    onSelectionEnd() {
        if (!this.hasArea()) {
            this.clearArea()
        }
    }

    focusOnSelectedCell() {
        if (this.state.selectedCell) {
            this.state.selectedCell.grabFocus()
        }
    }

    clear() {
        this.extendState({
            startCell: null,
            endCell: null,
            selectedCell: null
        })
    }

    clearArea() {
        this.extendState({
            startCell: null,
            endCell: null
        })
    }

    selectCell(cell) {
        this.extendState({
            selectedCell: cell,
            startCell: null,
            endCell: null
        })
    }

    setStartCell(cell) {
        const newState = {
            startCell: cell
        }

        // If no end cell is set, both start and end should reference the same cell
        if (!this.state.endCell) {
            newState.endCell = cell
        }

        this.extendState(newState)
    }

    setEndCell(cell) {
        const newState = {
            endCell: cell
        }

        // If no end cell is set, both start and end should reference the same cell
        if (!this.state.startCell) {
            newState.startCell = cell
        }

        this.extendState(newState)
    }

    setArea(startCell, endCell) {
        this.extendState({
            startCell,
            endCell
        })
    }

    setSelectedCell(cell) {
        this.extendState({
            selectedCell: cell
        })
    }

    // /**
    //  * Extracts and sets state from a substance selection
    //  *
    //  * Supports Property selections and custom table selections
    //  * @param {Substance.Selection} sel
    //  */
    // setStateFromSelection(sel) {
    //     let newState

    //     if (!sel) { return console.warn('No selection provided') }

    //     if (sel.type === 'property') {
    //         newState = this._extractStateFromPropertySelection(sel)
    //     }

    //     if (sel.type === 'custom' && sel.customType === 'TableSelection') {
    //         newState = this._extractStateFromTableSelection(sel)
    //     }

    //     if (newState) { this.setState(newState) }

    // }

    // /**
    //  * Extract component state from substance PropertySelection
    //  *
    //  * @param {Substance.PropertySelection} sel
    //  * @private
    //  */
    // _extractStateFromPropertySelection(sel) {
    //     console.info(sel)
    //     // Should check if property selection is inside a table cell
    //     const selectedCell = "FIND ME IF YOU CAN"
    //     return { selectedCell }
    // }

    // /**
    //  * Extract component state from TableSelection
    //  *
    //  * @param {TableSelection} sel
    //  * @private
    //  */
    // _extractStateFromTableSelection(sel) {
    //     const newState = {
    //         startCell: null,
    //         endCell: null,
    //         selectedCell: null
    //     }

    //     const data = sel.data

    //     if (data) {
    //         if (data.startCell) {
    //             newState.startCell = data.startCell
    //         }

    //         // If no endCell, set it to startCell
    //         newState.endCell = data.endCell || newState.startCell

    //         if (data.selectedCell) {
    //             newState.selectedCell = data.selectedCell

    //             // If no startCell, set it to selectedCell
    //             newState.startCell = newState.startCell || newState.selectedCell

    //             // If no endCell, set it to selectedCell
    //             newState.endCell = newState.endCell || newState.selectedCell

    //         } else {
    //             // If no selectedCell, set it to startCell
    //             newState.selectedCell = newState.startCell
    //         }
    //     }

    //     return newState
    // }

    positionSelection() {
        if (!this.shouldRenderAreaSelection()) {
            return this.refs.selection.css({
                display: 'none'
            })
        }
        this.refs.selection.css(this.getPositioningStyle())
    }

    shouldRenderAreaSelection() {
        return this.parent && this.hasArea()
    }

    getPositioningStyle() {
        const container = this.parent.getNativeElement()
        const firstCellElem = this.parent.refs[this.area.firstCellId].getNativeElement()
        const lastCellElem = this.parent.refs[this.area.lastCellId].getNativeElement()

        const containerBCR = container.getBoundingClientRect()
        const firstCellBCR = firstCellElem.getBoundingClientRect()
        const lastCellBCR = lastCellElem.getBoundingClientRect()

        const BORDER_WIDTH = 1;

        const style = {
            top: firstCellBCR.top - containerBCR.top - BORDER_WIDTH,
            left: firstCellBCR.left - containerBCR.left - BORDER_WIDTH,
            width: lastCellBCR.right - firstCellBCR.left + BORDER_WIDTH * 2,
            height: lastCellBCR.bottom - firstCellBCR.top + BORDER_WIDTH * 2
        }

        return style
    }

    render($$) {
        return $$('div', { class: 'table-selection' }).ref('selection')
    }
}

export default TableSelectionComponent

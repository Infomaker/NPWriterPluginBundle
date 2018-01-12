import {Component} from 'substance'
import TableArea from '../util/TableArea'

class TableSelectionComponent extends Component {

    didMount() {
        document.addEventListener('selectionchange', () => {
            this._updateArea()
        })
    }

    didUpdate() {
        this._updateArea()
    }

    _updateArea() {
        const startCellNode = this.state.startCell ? this.state.startCell.props.node : null
        const endCellNode = this.state.endCell ? this.state.endCell.props.node : null
        console.info('SETTING AREA: didupdate')
        const newArea = new TableArea(this.props.node, startCellNode, endCellNode)
        this.props.node.area = newArea
        this.area = newArea
        this.positionSelection()

        // Find a better way to do this: Set selection so command states update
        // if (startCellNode) {
        //     const es = this.context.editorSession
        //     es.setSelection(es.getSelection())
        // }

        // this.context.editorSession._setDirty('commandStates')

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
        console.info('Selection ended')
        // if (!this.hasArea()) {
        //     this.clearArea()
        // }
    }

    focusOnSelectedCell() {
        if (this.state.selectedCell) {
            this.state.selectedCell.grabFocus()
        }
    }

    clear() {
        // console.warn('Selection: Clearing selection')
        this.extendState({
            startCell: null,
            endCell: null,
            selectedCell: null
        })
    }

    clearArea() {
        // console.warn('Selection: Clearing area')
        let cell = this.state.startCell || null
        this.extendState({
            startCell: cell,
            endCell: cell
        })
    }

    selectCell(cell) {
        // console.info('Selecting cell')
        this.extendState({
            selectedCell: cell,
            startCell: this.state.startCell || cell,
            endCell: this.state.endCell || cell
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

    positionSelection() {
        if (!this.shouldRenderAreaSelection()) {
            return this.refs.selection.css({
                display: 'none'
            })
        }
        this.refs.selection.css(this.getPositioningStyle())
        if (this.props.debug) {
            this._positionDebugMarkers()
        }
    }

    _positionDebugMarkers() {
        const cbcr = this.refs.selection.getNativeElement().getBoundingClientRect()
        const sbcr = this.parent.refs[this.state.startCell.props.node.id]
            .getNativeElement()
            .getBoundingClientRect()

        const ebcr = this.parent.refs[this.state.endCell.props.node.id]
            .getNativeElement()
            .getBoundingClientRect()

        this.refs.start.css({
            top: sbcr.top - cbcr.top,
            left: sbcr.left - cbcr.left
        })

        this.refs.end.css({
            top: ebcr.bottom - cbcr.top - 13,
            left: ebcr.right - cbcr.left - 13
        })
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

    __logCommandState() {
        const cs = this.context.api.editorSession.getCommandStates()
        const dr = cs['table-delete-row']
        console.info('Delete row command state:')
        if(!dr.disabled) {
            console.info('\trows:', dr.rows, 'cols:', dr.cols)
            console.info('\trow:', dr.selectedRow, 'col:', dr.selectedCol)
        } else {
            console.info('\tdisabled')
        }
    }

    render($$) {
        // this.__logCommandState()
        return $$('div', { class: 'table-selection' },
            this._renderDebugMarkers($$)
        ).ref('selection')
    }

    _renderDebugMarkers($$) {
        if (!this.props.debug) {
            return []
        }

        return [
            $$('div', {class: 'table-selection-debug-start'}).ref('start'),
            $$('div', {class: 'table-selection-debug-end'}).ref('end'),
        ]
    }
}

export default TableSelectionComponent

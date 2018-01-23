import {Component} from 'substance'
import TableArea from '../util/TableArea'

class TableSelectionComponent extends Component {
    getInitialState() {
        return {
            startCell: null,
            endCell: null,
            selectedCell: null,
        }
    }

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
        document.addEventListener('selectionchange', () => {
            this._updateArea()
        })
    }

    didUpdate() {
        this._updateArea()
    }

    _onDocumentChange() {
        this._updateArea()
    }

    _updateArea() {
        const node = this.props.node
        let startCellNode = this.state.startCell ? this.state.startCell.props.node : null
        let endCellNode = this.state.endCell ? this.state.endCell.props.node : null

        if (startCellNode) {
            startCellNode = node.getCellById(startCellNode.id)
        }

        if (endCellNode) {
            endCellNode = node.getCellById(endCellNode.id)
        }

        if (!startCellNode) {
            startCellNode = endCellNode = node.getCellAt(0, 0)
        }

        const newArea = new TableArea(this.props.node, startCellNode, endCellNode)
        this.props.node.area = newArea
        this.area = newArea
        this.positionSelection()
    }

    hasArea() {
        const hasStartAndEndCells = this.state.startCell && this.state.endCell
        const startAndEndCellsDiffer = this.state.startCell !== this.state.endCell
        const temp = this.area.startCell && this.area.endCell // TODO: Rewrite
        return hasStartAndEndCells && startAndEndCellsDiffer && temp
    }

    getArea() {
        if (this.hasArea()) {
            return this.area
        }
        return null
    }

    /**
     * When selection event has ended on table component
     */
    onSelectionEnd() {}

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
        let cell = this.state.startCell || null
        this.extendState({
            startCell: cell,
            endCell: cell
        })
    }

    selectCell(cell) {
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
}

export default TableSelectionComponent

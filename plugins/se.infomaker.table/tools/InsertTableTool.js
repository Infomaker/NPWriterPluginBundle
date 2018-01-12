import '../scss/table-tool.scss'

import {Tool} from 'substance'
import {api} from 'writer'

class InsertTableTool extends Tool {
    getInitialState() {
        return {
            active: false,
            rows: 1,
            cols: 1
        }
    }

    render($$) {
        return $$('div', {class: 'insert-table-tool', title: this.getLabel('table-insert')}, [
            $$('button', {class: 'se-tool'}, [
                $$('i', {class: 'fa fa-table'}),
                this._renderTableSizePicker($$)
            ]).on('click', this.showTableSizePicker.bind(this))
        ])
    }

    _renderTableSizePicker($$) {
        if (!this.state.active) { return null }
        return this._generateTable($$, this.state.rows, this.state.cols)
    }

    _generateTable($$, rows, cols) {
        if (rows >= 20) { rows = 20 }
        if (cols >= 20) { cols = 20 }
        const tableElem = $$('table', { class: 'insert-table-tool-table' })
            .ref('table')
            .on('mouseover', this.handleTableSize.bind(this))
            .on('click', this.triggerInsert.bind(this))

        for (let row = 0; row < rows + 1; row++) {
            console.info('row-' + row)
            let rowElem = $$('tr', { class: 'insert-table-tool-row' }).ref('row-' + row)

            for (let col = 0; col < cols + 1; col++) {
                const classNames = ['insert-table-tool-cell']

                if ((row < rows || rows === 20) && (col < cols || cols === 20)) { classNames.push('selected') }
                console.info('cell-' + row + '-' + col)
                rowElem.append($$('td', {
                    class: classNames.join(' '),
                    'data-row': row + 1,
                    'data-col': col + 1
                }).ref('cell-' + row + '-' + col))
            }

            tableElem.append(rowElem)
        }
        return tableElem
    }

    handleTableSize(event) {
        const rows = parseInt(event.target.getAttribute('data-row'), 10) || null
        const cols = parseInt(event.target.getAttribute('data-col'), 10) || null
        console.info('Rows:', rows, 'Cols:', cols)

        if(rows && cols) {
            this.setTableSize(rows, cols)
        }
    }

    showTableSizePicker(event) {
        event.preventDefault()
        event.stopPropagation()
        this.extendState({
            active: true
        })
    }

    setTableSize(rows, cols) {
        if (rows === this.state.rows && cols === this.state.cols) {
            return
        }
        this.extendState({
            rows: (rows >= 20 ? 20 : rows),
            cols: (cols >= 20 ? 20 : cols)
        })
    }

    triggerInsert() {
        api.editorSession.executeCommand('table-insert-table', {
            tableSize: [this.state.rows, this.state.cols]
        })
    }
}

export default InsertTableTool

import '../scss/table-editor.scss'
import { Component } from 'substance'
import TableComponent from './TableComponent'

/**
 * Intended to allow the user to perform more advanced editing on a bigger surface
 *
 * Right now it's no different from the normal table
 */
class TableEditorDialogComponent extends Component {
    render($$) {
        return $$('div', {class: 'table-container editor'}, [
            this._renderHeaderMenu($$),
            this._renderContent($$)
        ])
    }

    _renderHeaderMenu($$) {
        return $$('div', {class: 'header'}, '')
    }

    _renderContent($$) {
        return (
            $$('div', {class: 'content'}, [
                $$(TableComponent, {
                    node: this.props.node,
                    disabled: false
                })
            ])
        )
    }

    onClose(status) { // eslint-disable-line
        return true
    }
}

export default TableEditorDialogComponent

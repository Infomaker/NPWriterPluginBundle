import '../scss/table-editor.scss'
import { Component } from 'substance'
import TableComponent from './TableComponent'

/**
 * The component that renders inside the dialog that openes when a table is inserted or edited
 *
 * Allows the user to:
 * - Edit individual cells
 * - Add/remove rows
 * - Add/remove columns
 * - Change table size
 * - Set alignment of columns
 * - Add/remove header/footer
 * - Set table caption
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

    onClose(status) {
        if (status === 'save') {
            console.info('Closing and saving')
        }
        return true
    }
}

export default TableEditorDialogComponent

/*
        <div class="table-editor-container">
            <div class="header">
                <ul class="menu">
                    <li class="menu-item">
                        <button>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/OOjs_UI_icon_table-insert-row-before.svg/24px-OOjs_UI_icon_table-insert-row-before.svg.png" alt="Insert row before">
                        </button>
                    </li>
                    <li class="menu-item">
                        <button>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/OOjs_UI_icon_close-ltr.svg/24px-OOjs_UI_icon_close-ltr.svg.png" alt="Remove row">
                        </button>
                    </li>
                    <li class="menu-item">
                        <button>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/OOjs_UI_icon_table-insert-row-after.svg/24px-OOjs_UI_icon_table-insert-row-after.svg.png" alt="Insert row after">
                        </button>
                    </li>
                    <li class="menu-item-separator"></li>
                    <li class="menu-item">
                        <button>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/OOjs_UI_icon_table-insert-column-ltr.svg/24px-OOjs_UI_icon_table-insert-column-ltr.svg.png" alt="Insert column before">
                        </button>
                    </li>
                    <li class="menu-item">
                        <button>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/OOjs_UI_icon_close-ltr.svg/24px-OOjs_UI_icon_close-ltr.svg.png" alt="Remove column">
                        </button>
                    </li>
                    <li class="menu-item">
                        <button>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/OOjs_UI_icon_table-insert-column-rtl.svg/24px-OOjs_UI_icon_table-insert-column-rtl.svg.png" alt="Insert column after">
                        </button>
                    </li>
                </ul>
            </div>
            <div class="content">
                <table>
                    <caption>Table caption</caption>
                    <thead>
                        <tr>
                            <th>Header content 1</th>
                            <th>Header content 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Body content 1</td>
                            <td>Body content 2</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>Footer content 1</td>
                            <td>Footer content 2</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
*/

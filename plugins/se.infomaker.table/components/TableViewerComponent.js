import '../scss/table-viewer.scss'
import { Component } from 'substance'
import TableComponent from './TableComponent'

class TableViewerComponent extends Component {

    render($$) {
        console.info('Rendering table viewer component')
        return $$('div', {class: 'im-blocknode__container im-table'}, [
            $$('div', {class: 'header'}, [
                $$('strong', null, this.props.node.caption),
                $$('span', {class:'edit-button'}, [
                    $$('i', {class: 'fa fa-pencil'})
                ]).on('click', this._openTableEditor.bind(this))
            ]),
            $$('div', {class: 'table-viewer-container '}, [
                $$(TableComponent, {
                    node: this.props.node,
                    disabled: false
                }).ref('table'),
            ]).ref('change-me-2')
        ]).ref('change-me-1').on('mousedown', (event) => {
            event.stopPropagation()
            console.info('Clicked on isolated node')
            this.grabFocus()
        }, false)
    }

    didUpdate() {
        const isolatedMode = this.context.isolatedNodeComponent.getMode()

        if (isolatedMode !== 'focused') {
            this.refs.table.resetSelection()
        }
    }

    _openTableEditor() {
        const { api } = this.context
        api.editorSession.executeCommand('OpenTableEditor', {
            tableNodeId: this.props.node.id
        })
    }

    _toggleHeader() {
        const { api } = this.context
        api.editorSession.executeCommand('ToggleHeader', {})
    }

    /**
     * Grabs focus on the table component
     *
     * This method is run automatically when stepping into the isolated node by pressing Tab
     * and through
     */
    grabFocus() {
        const isolatedNode = this.context.isolatedNodeComponent
        // Make sure that the node is not already focused yet
        if (isolatedNode.state.mode !== 'focused') {
            console.info('Forcing focus on isolated node')
            isolatedNode.extendState({
                mode: 'focused',
                unblocked: true
            })
            this.refs.table.grabFocus(true)
        }
    }
}

export default TableViewerComponent

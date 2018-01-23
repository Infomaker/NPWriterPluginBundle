import '../scss/table-viewer.scss'
import { Component } from 'substance'
import TableComponent from './TableComponent'

class TableViewerComponent extends Component {

    render($$) {
        return $$('div', {class: 'im-blocknode__container im-table'}, [
            $$('div', {class: 'header'}, [
                this._renderCaptionEditor($$)
            ]),
            $$('div', {class: 'table-viewer-container '}, [
                $$(TableComponent, {
                    node: this.props.node,
                    disabled: false
                }).ref('table'),
            ])
        ]).on('mousedown', (event) => {
            event.stopPropagation()
            this.grabFocus()
        }, false)
    }

    didUpdate() {
        const isolatedMode = this.context.isolatedNodeComponent.getMode()
        if (isolatedMode !== 'focused') {
            this.refs.table.resetSelection()
        }
    }

    _renderCaptionEditor($$) {
        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        const editorProps = {
            node: this.props.node,
            multiLine: false,
            field: 'caption',
            tagname: 'strong',
            icon: 'fa-table',
            placeholder: this.getLabel('table-caption')
        }

        // This is needed because the TextPropertyEditorComponent captures all input and stops
        // propagation so we hijack the _handleEnterKey and _handleTabKey methods with our own
        // which allows us to escape from the caption editor and select a cell.
        if (this.refs['table-caption-editor']) {
            const textEditor = this.refs['table-caption-editor'].refs.caption
            textEditor._handleEnterKey = this._captureFieldEditorEvents.bind(this)
            textEditor._handleTabKey = this._captureFieldEditorEvents.bind(this)
        }

        const captionEditor = $$(FieldEditor, editorProps).ref('table-caption-editor')
        return captionEditor
    }

    _captureFieldEditorEvents(event) {
        event.preventDefault()
        event.stopPropagation()
        this.refs.table.resetSelection()
        this.refs.table.grabFocus(true)
    }

    /**
     * Grabs focus on the table component
     *
     * This method is run automatically when stepping into the isolated node by pressing Tab
     * and through a mousedown event handler bound to the component.
     */
    grabFocus() {
        const isolatedNode = this.context.isolatedNodeComponent
        // Make sure that the node is not already focused yet
        if (isolatedNode.state.mode === 'selected') {
            isolatedNode.extendState({
                mode: 'focused',
                unblocked: true
            })
            this.refs.table.resetSelection()
            this.refs.table.grabFocus(true)
        }
    }
}

export default TableViewerComponent

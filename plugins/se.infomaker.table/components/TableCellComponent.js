import {Component, TextPropertyEditor} from 'substance'

class TableCellComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    _onDocumentChange(change) {
        if (change.isAffected([this.props.node.id])) {
            console.info('Change affected table cell node')
            this.rerender()
        }
    }

    shouldRerender(newProps) {
        const headerChanged = this.props.header !== newProps.header
        const selectionStateChanged = this.props.selectionState !== newProps.selectionState
        return headerChanged || selectionStateChanged
    }

    render($$) {
        const node = this.props.node
        const cellType = this.props.header ? 'th' : 'td'
        const classNames = []

        if (this.props.selectionState === 'selected') {
            classNames.push('selected')
        }

        if (this.props.selectionState === 'focused') {
            classNames.push('focused')
        }

        const cellAttributes = {
            class: classNames.join(' ')
        }

        if (node.rowspan > 0) { cellAttributes.rowspan = node.rowspan }
        if (node.colspan > 0) { cellAttributes.colspan = node.colspan }

        const editor = $$(TextPropertyEditor, {
            path: node.getTextPath(),
            disabled: this._isDisabled(),
            multiline: false
        }).ref('editor').on('keypress', () => {
            console.info('context', this.context)
        })

        if (this.refs.editor) {
            this.refs.editor._handleEnterKey = this._handleEnterKey.bind(this)
            this.refs.editor._handleTabKey = this._handleTabKey.bind(this)
        }

        return $$(cellType, cellAttributes, [
            editor
        ]).ref('cell')
    }

    _isDisabled() {
        return this.props.disabled || this.props.selectionState !== 'focused'
    }

    _handleEnterKey() {
        // console.info('Capturing enter key', event)
    }

    _handleTabKey(event) {
        console.info('Capturing tab key', event)
    }

    grabFocus(selectContents=false) {
        let node = this.props.node
        this.context.editorSession.setSelection({
            type: 'property',
            path: node.getPath(),
            startOffset: (selectContents ? 0 : node.getLength()),
            endOffset: node.getLength(),
            surfaceId: this.refs.editor.id
        })
        // setTimeout(() => {
        //     console.info('Setting native focus')
        //     window.getSelection().collapse(this.refs.editor.getNativeElement())
        // }, 2000)
    }
}

TableCellComponent.prototype._isTableCellComponent = true
export default TableCellComponent

import {Tool, keys} from 'substance'
import {UITooltip} from 'writer'

/**
 * Tool to edit an existing link.
 *
 * Designed so that it can be used either in a toolbar, or within
 * an overlay on the Surface.
 *
 * @memberof Tool
 * @ignore
 */
class EditLinkTool extends Tool {

    getUrlPath() {
        let propPath = this.constructor.urlPropertyPath
        return [this.props.node.id].concat(propPath)
    }

    _openLink() {
        let doc = this.context.editorSession.getDocument()
        window.open(doc.get(this.getUrlPath()), '_blank')
    }

    dispose() {
        this.el.getOwnerDocument().off('keydown')
    }

    handleEnterAndEsc(e) {

        if (e.keyCode === keys.ENTER || e.keyCode === keys.ESCAPE) {
            this.refs.link.getNativeElement().blur() // Trigger blur event trigger _onChange in input component
            this.context.editorSession.transaction((tx) => {
                const node = this.props.node
                const selection = this.context.editorSession.getSelection()
                selection.start.offset = node.end.offset
                selection.end.offset = node.end.offset
                tx.setSelection(selection)

            })
            e.preventDefault()
            e.stopPropagation()
        }

    }

    didMount() {
        this.el.getOwnerDocument().on('keydown', (e) => {
            if (e.altKey && e.keyCode === 75) { // alt+k sets focus in the input
                const linkInput = this.refs.link
                linkInput.getNativeElement().focus()
                linkInput.val(linkInput.val()) // Set cursor at the end
                e.stopPropagation()
                e.preventDefault()
            }
        })

    }

    render($$) {
        let Input = this.getComponent('input')
        let Button = this.getComponent('button')
        let el = $$('div').addClass('sc-edit-link-tool sc-annotation-group')

        // GUARD: Return if tool is disabled
        if (this.props.disabled) {
            console.warn('Tried to render EditLinkTool while disabled.')
            return el
        }

        let urlPath = this.getUrlPath()

        el.append([
            $$(Input, {
                type: 'url',
                path: urlPath,
                placeholder: this.getLabel('ALT+k to edit')
            }).on('keydown', this.handleEnterAndEsc).ref('link'),

            $$(Button, {
                icon: 'open-link',
                style: this.props.style
            })
                .addClass('edit-link-btn visit')
                .append($$(UITooltip, {title: this.getLabel('open-link')}).ref('tooltipOpenLink'))
                .on('click', this._openLink)
                .on('mouseover', () => {
                    this.refs.tooltipOpenLink.extendProps({
                        show: true
                    })
                })
                .on('mouseout', () => {
                    this.refs.tooltipOpenLink.extendProps({
                        show: false
                    })
                })
            ,
            $$(Button, {
                icon: 'delete',
                style: this.props.style
            })
                .addClass('edit-link-btn')
                .append($$(UITooltip, {title: this.getLabel('delete-link')}).ref('tooltipRemoveLink'))
                .on('mouseover', () => {
                    this.refs.tooltipRemoveLink.extendProps({
                        show: true
                    })
                })
                .on('mouseout', () => {
                    this.refs.tooltipRemoveLink.extendProps({
                        show: false
                    })
                })
                .on('click', this.onDelete)
        ])
        return el
    }

    onDelete(e) {
        e.preventDefault();
        let node = this.props.node
        let sm = this.context.surfaceManager
        let surface = sm.getFocusedSurface()
        if (!surface) {
            console.warn('No focused surface. Stopping command execution.')
            return
        }
        let editorSession = this.context.editorSession
        editorSession.transaction(function (tx, args) {
            tx.delete(node.id)
            return args
        })
    }
}

EditLinkTool.urlPropertyPath = ['url']

export default EditLinkTool

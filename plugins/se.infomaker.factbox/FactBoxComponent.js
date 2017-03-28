import {
    Component,
    ContainerEditor,
    EmphasisCommand,
    FontAwesomeIcon,
    StrongCommand,
    SwitchTextCommand,
    TextPropertyEditor,
} from 'substance'

class FactBoxComponent extends Component {

    grabFocus() {
        const title = this.refs.title
        const start = title.textContent === 'Rubrik' ? 0 : title.textContent.length
        this.context.editorSession.setSelection({
            type: 'property',
            path: title.getPath(),
            startOffset: start,
            endOffset: title.textContent.length
        })
    }

    render ($$) {
        const el = $$('div')
        el.addClass('factbox-node im-blocknode__container')
        el.append(this.renderHeader($$))
        el.append(this.renderTitleEditor($$, true))
        el.append(this.renderTitleEditor($$))
        el.append(this.renderContainerEditor($$))
        return el
    }

    shouldRerender() {
        return false
    }

    /**
     * Renders the component's header.
     */
    renderHeader($$) {
        return $$('div')
            .append([
                $$(FontAwesomeIcon, { icon: 'fa-bullhorn' })
            ])
            .addClass('header')
    }

    /**
     * Renders the editor for the factbox's title.
     */
    renderTitleEditor($$, vignette) {
        const field = vignette ? 'vignette' : 'title'
        const titleContainer = $$('div').addClass('im-blocknode__content full-width')
        const titleEditor = $$(TextPropertyEditor, {
            path: [this.props.node.id, field],
            doc: this.props.doc
        }).ref(field).addClass('factbox-title')

        const icon = $$(FontAwesomeIcon, { icon: 'fa-header' })

        titleContainer.append([icon, titleEditor])
        return titleContainer
    }

    renderContainerEditor($$) {
        return $$(ContainerEditor, {
            name: 'factEditor',
            containerId: this.containerNode().id,
            textTypes: [],
            commands: [StrongCommand, EmphasisCommand, SwitchTextCommand]
        }).ref('editor').addClass('fact-editor')
    }

    /**
     * Returns the container node for this component.
     */
    containerNode() {
        return this.context.doc.data.nodes[this.props.node.id + '-container']
    }

}

FactBoxComponent.fullWidth = true

export default FactBoxComponent

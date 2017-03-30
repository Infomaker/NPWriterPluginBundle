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

    render($$) {
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
                $$(FontAwesomeIcon, {icon: 'fa-bullhorn'}),
                $$('span').append(this.getLabel('Factbox'))
            ])
            .addClass('header')
    }

    /**
     * Renders the editor for the factbox's title.
     */
    renderTitleEditor($$, vignette) {
        const field = vignette ? 'vignette' : 'title'
        const titleContainer = $$('div').addClass('im-blocknode__content full-width im-fact-field')

        const inputContainer = $$('div')
        const inputPlaceholder = $$('div').append(this.getLabel(field)).ref('ph-' + field)

        if (!this.props.node[field]) {
            inputPlaceholder.addClass('im-placeholder-visible')
        }

        const titleEditor = $$(TextPropertyEditor, {
            path: [this.props.node.id, field],
            doc: this.props.doc
        }).ref(field)
            .on('focus', () => {
                this.refs['ph-' + field].removeClass('im-placeholder-visible')
            })
            .on('blur', () => {
                if (!this.props.node[field]) {
                    this.refs['ph-' + field].addClass('im-placeholder-visible')
                }
            })

        inputContainer.append([titleEditor, inputPlaceholder])

        const icon = $$(FontAwesomeIcon, {icon: 'fa-header'})
        titleContainer.append([icon, inputContainer])

        return titleContainer
    }

    renderContainerEditor($$) {
        return $$(ContainerEditor, {
            name: 'factEditor' + this.props.node.id,
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

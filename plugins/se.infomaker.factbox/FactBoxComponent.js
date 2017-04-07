import {
    Component,
    ContainerEditor,
    EmphasisCommand,
    FontAwesomeIcon,
    StrongCommand,
    SwitchTextCommand,
    TextPropertyEditor,
} from 'substance'

import {api} from 'writer'

class FactBoxComponent extends Component {

    /**
     * Default state before actions happens (render).
     *
     * Get initial state for factbox
     * @returns {object}
     */
    getInitialState() {
        return {
            showInlineTextMenu: false,
            inlineTexts: api.getConfigValue('se.infomaker.factbox', 'inlineTexts')
        }
    }

    render($$) {
        const el = $$('div')
        el.addClass('factbox-node im-blocknode__container')
        el.append(this.renderHeader($$))
        el.append(this.renderTitleEditor($$, true))
        el.append(this.renderTitleEditor($$))
        el.append(this.renderContainerEditor($$))
        return el
    }

    /**
     * Renders the component's header.
     */
    renderHeader($$) {
        return $$('div')
            .append([
                $$('div').append($$(FontAwesomeIcon, {icon: 'fa-bullhorn'})),
                this.renderType($$)
            ])
            .addClass('header')
    }

    renderType($$) {
        if (this.state.inlineTexts && this.state.inlineTexts.length > 0) {
            return this.renderTypeDropDown($$)
        } else {
            return $$('span').append(api.getConfigValue('se.infomaker.factbox', 'standaloneDefault', 'Unknown'))
        }
    }

    getSelectedInlineTextName() {
        let selectedInlineTextName

        this.state.inlineTexts.forEach((inlineText) => {
            if (this.props.node.inlineTextUri && this.props.node.inlineTextUri === inlineText.uri) {
                selectedInlineTextName = inlineText.name
            } else if (!this.props.node.inlineTextUri && inlineText.default) {
                selectedInlineTextName = inlineText.name
            }
        })

        if (selectedInlineTextName) {
            return selectedInlineTextName
        } else {
            console.error('Invalid configuration of plugin. Missing default inline-texts in configuration')
        }
    }

    selectInlineText(inlineText) {
        api.editorSession.transaction((tx) => {
            tx.set([this.props.node.id, 'inlineTextUri'], inlineText.uri)
        })

        this.extendState({
            showInlineTextMenu: false,
            inlineTexts: this.state.inlineTexts
        })
    }

    renderTypeDropDown($$) {
        let dropdownButton = $$('button').addClass('btn btn-secondary dropdown-toggle').attr({
            id: 'w-inlinetext-main-select',
            type: 'button',
            'data-toggle': 'dropdown'
        }).append([
            this.getSelectedInlineTextName()
        ])

        dropdownButton.on('click', () => {
            this.toggleMenu();
            return false
        })

        dropdownButton.ref('dropdownButton')
        let components = [dropdownButton];

        if (this.state.showInlineTextMenu) {
            const inlineTextElements = this.state.inlineTexts.map((inlineText) => {
                return $$('button').addClass('dropdown-item').append(
                    inlineText.name
                ).on('click', () => {
                    this.selectInlineText(inlineText)
                })
            })

            const inlineTextMenu = $$('div').addClass('dropdown-menu').append(
                inlineTextElements
            )
            components = [...components, inlineTextMenu]
        }

        return $$('div').attr({id: 'w-inlinetext-main'}).addClass('dropdown').attr({
            'aria-labelledby': 'w-inlinetext-main-select'
        }).append(components)
    }

    /**
     * Renders the editor for the factbox's title.
     */
    renderTitleEditor($$, vignette) {
        const field = vignette ? 'vignette' : 'title'
        const titleContainer = $$('div').addClass('im-blocknode__content full-width im-fact-field')

        const inputContainer = $$('div')
        const inputPlaceholderText = api.getConfigValue('se.infomaker.factbox', 'placeholderText.' + field, field)

        const inputPlaceholder = $$('div').append(inputPlaceholderText).ref('ph-' + field)
        const elem = (this.refs[field]) ? this.refs[field].getNativeElement() : null

        if (!this.props.node[field] && document.activeElement !== elem) {
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
            textTypes: writer.api.configurator.getTextTypes(),
            commands: [StrongCommand, EmphasisCommand, SwitchTextCommand]
        }).ref('editor').addClass('fact-editor')
    }

    toggleMenu() {
        this.extendState({showInlineTextMenu: !this.state.showInlineTextMenu})
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

import {
    Component,
    ContainerEditor,
    EmphasisCommand,
    FontAwesomeIcon,
    StrongCommand,
    SwitchTextCommand
} from 'substance'

import {api} from 'writer'
import FieldEditor from './FieldEditor'

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
            inlineTexts: api.getConfigValue('se.infomaker.factbox', 'inlineTexts'),
            selectedUri: null
        }
    }

    render($$) {
        // this.parent.removeClass('sm-focused')
        console.log("Focused", this.parent.isFocused());
        const el = $$('div')
        el.addClass('factbox-node im-blocknode__container')
        el.append(this.renderHeader($$))

        el.append($$(FieldEditor, {
            node: this.props.node,
            field: 'title',
            placeholder: api.getConfigValue('se.infomaker.factbox', 'placeholderText.title', 'title')
        }).ref('titleFieldEditor'))

        el.append($$(FieldEditor, {
            node: this.props.node,
            field: 'vignette',
            placeholder: api.getConfigValue('se.infomaker.factbox', 'placeholderText.vignette', 'vignette')
        }).ref('vignetteFieldEditor'))

        el.append(this.renderContainerEditor($$))

        // If we loose focus we need to reset showInlineTextMenu
        if (this.state.showInlineTextMenu && !this.parent.isFocused()) {
            if(!this.__isRendering__) {
                this.extendState({
                    showInlineTextMenu: false
                })
            }

        }
        return el
    }

    /**
     * Renders the component's header.
     */
    renderHeader($$) {
        return $$('div')
            .append([
                $$(FontAwesomeIcon, {icon: 'fa-bullhorn'}),
                ...this.renderType($$)
            ])
            .addClass('header')
    }


    renderType($$) {
        if (this.state.inlineTexts && this.state.inlineTexts.length > 0) {
            const components = [
                this.getCurrent($$),
                $$(FontAwesomeIcon, {icon: 'fa-sort'})
            ]

            if (this.state.showInlineTextMenu && this.parent.isFocused()) {
                components.push(this.renderDropDown($$))
            }
            return components
        } else {
            return $$('span').append(api.getConfigValue('se.infomaker.factbox', 'standaloneDefault', 'Unknown'))
        }
    }


    toggleDropDown() {
        this.parent.addClass('sm-focused')
        this.extendState({
            showInlineTextMenu: !this.state.showInlineTextMenu
        })
        this.parent.setState({
            mode: "focused",
            unblocked: true
        })
    }

    /**
     * Renders the current choosen content part and handles the click
     * @param $$
     */
    getCurrent($$) {
        return $$('span')
            .append(this.getSelectedContentPartName())
            .on('click', this.toggleDropDown.bind(this))
    }

    getSelectedContentPartName() {
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

    renderDropDown($$) {
        const list = $$('ul').addClass('available-content-part__list')
        const inlineTextElements = this.state.inlineTexts.map((text) => {
            return $$('li').append(text.name)
        })
        list.append(inlineTextElements)
        return list
    }

    renderContainerEditor($$) {
        return $$(ContainerEditor, {
            name: 'factEditor' + this.props.node.id,
            containerId: this.props.node.id,
            textTypes: [],
            commands: [StrongCommand, EmphasisCommand, SwitchTextCommand]
        }).ref('editor').addClass('fact-editor')
    }

    toggleMenu() {
        this.extendState({showInlineTextMenu: !this.state.showInlineTextMenu})
    }

}

FactBoxComponent.fullWidth = true

export default FactBoxComponent

/* renderTypeDropDown($$) {
 let dropdownButton = $$('button').addClass('btn btn-secondary dropdown-toggle').attr({
 id: 'w-inlinetext-main-select',
 type: 'button',
 'data-toggle': 'dropdown'
 }).append([
 this.getSelectedContentPartName()
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
 }*/
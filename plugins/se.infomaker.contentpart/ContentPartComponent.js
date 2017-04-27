import {
    Component,
    ContainerEditor,
    EmphasisCommand,
    FontAwesomeIcon,
    StrongCommand,
    SwitchTextCommand
} from 'substance'

import DropDownHeadline from './DropDownHeadline'
import {api} from 'writer'

class ContentPartComponent extends Component {

    /**
     * Default state before actions happens (render).
     *
     * Get initial state for Contentpart
     * @returns {object}
     */
    getInitialState() {
        return {
            showInlineTextMenu: false,
            contentpartTypes: api.getConfigValue('se.infomaker.contentpart', 'contentpartTypes'),
            selectedUri: null
        }
    }

    render($$) {
        const el = $$('div')
        el.addClass('contentpart-node im-blocknode__container')
        el.append(this.renderHeader($$))

        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        el.append($$(FieldEditor, {
            node: this.props.node,
            multiLine: true,
            field: 'title',
            placeholder: this.getLabel(api.getConfigValue('se.infomaker.contentpart', 'placeholderText.title', 'title'))
        }).ref('titleFieldEditor'))

        el.append($$(FieldEditor, {
            node: this.props.node,
            field: 'vignette',
            placeholder: this.getLabel(api.getConfigValue('se.infomaker.contentpart', 'placeholderText.vignette', 'vignette'))
        }).ref('vignetteFieldEditor'))

        el.append(this.renderContainerEditor($$))


        return el
    }

    /**
     * Renders the component's header.
     */
    renderHeader($$) {

        const dropdownheader = $$(DropDownHeadline, {
            icon: 'fa-sort',
            items: this.state.contentpartTypes,
            node: this.props.node,
            isolatedNodeComponent: this.parent,
            change: this.selectInlineText.bind(this)
        }).ref('dropdownHeadline')

        return $$('div')
            .append([
                $$(FontAwesomeIcon, {icon: 'fa-bullhorn'}),
                dropdownheader
            ])
            .addClass('header')

    }

    selectInlineText(inlineText) {
        api.editorSession.transaction((tx) => {
            tx.set([this.props.node.id, 'contentpartUri'], inlineText.uri)
        })

        this.extendState({
            showInlineTextMenu: false,
            contentpartTypes: this.state.contentpartTypes
        })
    }



    renderContainerEditor($$) {
        return $$(ContainerEditor, {
            name: 'contentpartEditor' + this.props.node.id,
            containerId: this.props.node.id,
            textTypes: [],
            commands: [StrongCommand, EmphasisCommand, SwitchTextCommand]
        }).ref('editor').addClass('contentpart-editor')
    }

    toggleMenu() {
        this.extendState({showInlineTextMenu: !this.state.showInlineTextMenu})
    }

}

ContentPartComponent.fullWidth = true

export default ContentPartComponent

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
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
        const currentPartConfig = this.state.contentpartTypes.filter(contentPartType => contentPartType.uri === this.props.node.contentpartUri).pop()
        const displayTitle = (currentPartConfig && currentPartConfig.displayTitle !== undefined) ? currentPartConfig.displayTitle : true
        const displaySubject = (currentPartConfig && currentPartConfig.displaySubject !== undefined) ? currentPartConfig.displaySubject : true
        const displayText = (currentPartConfig && currentPartConfig.displayText !== undefined) ? currentPartConfig.displayText : true

        const el = $$('div')
        el.addClass('contentpart-node im-blocknode__container')

        el.append(this.renderHeader($$))

        const FieldEditor = this.context.api.ui.getComponent('field-editor')

        if (displayTitle) {
            el.append($$(FieldEditor, {
                node: this.props.node,
                icon: this.getPlaceholderIcon('title', 'fa-header'),
                multiLine: true,
                field: 'title',
                placeholder: this.getLabel(this.getPlaceholderText('title', 'title'))
            }))
        }

        if (displaySubject) {
            el.append($$(FieldEditor, {
                node: this.props.node,
                icon: this.getPlaceholderIcon('subject', 'fa-pencil'),
                field: 'subject',
                placeholder: this.getLabel(this.getPlaceholderText('subject') || this.getPlaceholderText('vignette', 'vignette'))
            }))
        }

        if (displayText) {
            el.append(this.renderContainerEditor($$))
        }

        return el
    }

    getPlaceholderText(fieldName, defaultText) {
        const currentUri = this.props.node.contentpartUri
        const defaultPlaceholder = api.getConfigValue('se.infomaker.contentpart', `placeholderText.${fieldName}`, defaultText)
        const customPlaceholder = api.getConfigValue('se.infomaker.contentpart', `placeholderText.${currentUri}.${fieldName}`)
        return customPlaceholder || defaultPlaceholder
    }

    getPlaceholderIcon(fieldName, defaultIcon) {
        const currentUri = this.props.node.contentpartUri
        const defaultFieldIcon = api.getConfigValue('se.infomaker.contentpart', `placeholderIcon.${fieldName}`, defaultIcon)
        const customFieldIcon = api.getConfigValue('se.infomaker.contentpart', `placeholderIcon.${currentUri}.${fieldName}`)
        return customFieldIcon || defaultFieldIcon
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

    /**
     * When selecting a content part type in a drop down list
     * Update `contentpartUri` property on the node
     * and change the component state to hide the dropdown
     * @param inlineText
     */
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

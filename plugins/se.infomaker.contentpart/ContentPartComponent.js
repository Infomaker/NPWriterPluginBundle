import { Component, ContainerEditor, EmphasisCommand, FontAwesomeIcon, StrongCommand, SwitchTextCommand } from 'substance'
import DropDownHeadline from './DropDownHeadline'
import { api } from 'writer'

import ContentPartManager from './ContentPartManager'

/**
 * @typedef ContentPartComponent.Props
 * @property {Node} node
 * @property {String} isolatedNodeState
 */

/**
 * @typedef ContentPartComponent.State
 * @property {ContentPart.Type} contentPartType - The current content part type
 */

/**
 * Content part component
 *
 * @param {ContentPartComponent.Props} props
 * @property {ContentPartComponent.Props} props
 * @property {ContentPartComponent.State} state
 */
class ContentPartComponent extends Component {

    /**
     * Loads the ContentPartManager
     * @private
     */
    _loadManager() {
        this.manager = new ContentPartManager(this.props.node)
    }

    /**
     * @param {ContentPartComponent.Props} oldProps
     * @param {ContentPartComponent.State} oldState
     */
    shouldRerender(oldProps, oldState) {
        const isolatedNodeStateChanged = this.props.isolatedNodeState !== oldProps.isolatedNodeState
        const contentPartTypeChanged = this.state.contentPartType.uri !== oldState.contentPartType.uri

        return contentPartTypeChanged || isolatedNodeStateChanged
    }

    /**
     * @returns {ContentPartComponent.State}
     */
    getInitialState() {
        // Manager has to be loaded here as getInitialState is called before the constructor has completed
        this._loadManager()
        const contentPartUri = this.props.node.contentPartUri
        const initialContentPartType = contentPartUri ? this.manager.getContentPartTypeByURI(contentPartUri) : this.manager.getDefaultContentPartType()

        return {
            contentPartType: initialContentPartType
        }
    }

    render($$) {
        return $$('div', { class: 'contentpart-node im-blocknode__container' }, [
            this._renderHeader($$),
            this.state.contentPartType.fields.map(field => this._renderFieldsByType($$, field))
        ]).ref('container')
    }

    /**
     * @param {*} $$
     * @param {ContentPartManager.Field} field
     */
    _renderFieldsByType($$, field) {
        switch (field.type) {
            case '__ContainerEditor__':
                return this._renderContainerEditor($$, field)
            case 'datetime':
            case 'date':
            case 'time':
                return this._renderDateField($$, field)
            case 'text':
            default:
                return this._renderTextField($$, field)
        }
    }

    _renderTextField($$, field) {
        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        const editorProps = {
            node: this.props.node,
            multiLine: field.multiLine,
            field: ['fields', field.id],
            placeholder: this.getLabel(field.label)
        }
        if (field.icon) { editorProps.icon = field.icon }

        const refName = `field-${field.id}-${this.state.contentPartType.uri}`
        return $$(FieldEditor, editorProps).ref(refName)
    }

    _renderDateField($$, field) {
        const DatetimeFieldEditor = this.context.api.ui.getComponent('datetime-field-editor')
        const editorProps = {
            node: this.props.node,
            field: ['fields', field.id],
            label: this.getLabel(field.label),
            type: field.type
        }
        if (field.icon) { editorProps.icon = field.icon }

        const refName = `field-${field.id}-${this.state.contentPartType.uri}`
        return $$(DatetimeFieldEditor, editorProps).ref(refName)
    }

    _renderContainerEditor($$) {
        return $$(ContainerEditor, {
            name: 'contentpartEditor' + this.props.node.id,
            containerId: this.props.node.id,
            textTypes: this.manager.enableTextTypes ? this.context.configurator.getTextTypes() : [],
            commands: [StrongCommand, EmphasisCommand, SwitchTextCommand]
        }).ref('editor').addClass('contentpart-editor')
    }

    /**
     * Renders the component's header.
     */
    _renderHeader($$) {
        const dropdownheader = $$(DropDownHeadline, {
            icon: 'fa-sort',
            items: this.manager.getContentPartTypes(),
            node: this.props.node,
            isolatedNodeComponent: this.parent,
            change: this.selectInlineText.bind(this)
        }).ref('dropdownHeadline')

        return $$('div', { class: 'header' }, [
            $$(FontAwesomeIcon, { icon: 'fa-bullhorn' }),
            dropdownheader
        ])
    }

    /**
     * When selecting a content part type in a drop down list
     * Update `contentPartUri` property on the node
     * and change the component state to hide the dropdown
     * @param inlineText
     */
    selectInlineText(inlineText) {
        api.editorSession.transaction((tx) => {
            tx.set([this.props.node.id, 'contentPartUri'], inlineText.uri)
        })
        this.extendState({
            contentPartType: this.manager.getContentPartTypeByURI(inlineText.uri)
        })
    }
}

// Does this do anything?
ContentPartComponent.fullWidth = true

export default ContentPartComponent

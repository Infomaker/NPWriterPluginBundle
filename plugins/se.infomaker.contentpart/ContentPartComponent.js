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

import ContentPartManager from './ContentPartManager'

class ContentPartComponent extends Component {

    _loadManager() {
        this.manager = new ContentPartManager(this.props.node)
    }

    shouldRerender(oldProps, oldState) {
        const showInlineTextMenuChanged = this.state.showInlineTextMenu !== oldState.showInlineTextMenu
        const isolatedNodeStateChanged = this.props.isolatedNodeState !== oldProps.isolatedNodeState
        const contentPartTypeChanged = this.state.contentPartType.uri !== oldState.contentPartType.uri

        return contentPartTypeChanged || isolatedNodeStateChanged || showInlineTextMenuChanged
    }

    getInitialState() {
        // Manager has to be loaded here as getInitialState is called before the constructor has completed
        this._loadManager()
        const contentPartUri = this.props.node.contentpartUri

        const initialContentPartType = contentPartUri ? this.manager.getContentPartTypeByURI(contentPartUri) : this.manager.getDefaultContentPartType()
        return {
            showInlineTextMenu: false,
            contentPartType: initialContentPartType,
            selectedUri: null
        }
    }

    render($$) {
        return $$('div', {class: 'contentpart-node im-blocknode__container'}, [
            this.renderHeader($$),
            this.state.contentPartType.fields.map(field => this.renderFieldsByType($$, field))
        ])
    }

    renderFieldsByType($$, field) {
        switch (field.type) {
            case '__ContainerEditor__':
                return this.renderContainerEditor($$, field)
            case 'datetime':
            case 'date':
            case 'time':
                return this.renderDateField($$, field)
            case 'text':
            default:
                return this.renderTextField($$, field)
        }
    }

    renderTextField($$, field) {
        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        const editorProps = {
            node: this.props.node,
            multiLine: field.multiLine,
            field: ['fields', field.id],
            placeholder: this.getLabel(field.label),
            _cache: new Date()
        }
        if (field.icon) { editorProps.icon = field.icon }

        return $$(FieldEditor, editorProps)
    }

    renderDateField($$, field) {
        const DatetimeFieldEditor = this.context.api.ui.getComponent('datetime-field-editor')
        const editorProps = {
            node: this.props.node,
            field: ['fields', field.id],
            label: this.getLabel(field.label),
            type: field.type
        }
        if (field.icon) { editorProps.icon = field.icon }
        const refName = `field-${field.id}-${this.props.node.contentpartUri}`
        console.info('ref-name', refName)
        return $$(DatetimeFieldEditor, editorProps).ref(refName)
    }

    renderContainerEditor($$) {
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
    renderHeader($$) {
        const dropdownheader = $$(DropDownHeadline, {
            icon: 'fa-sort',
            items: this.manager.getContentPartTypes(),
            node: this.props.node,
            isolatedNodeComponent: this.parent,
            change: this.selectInlineText.bind(this)
        }).ref('dropdownHeadline')

        return $$('div', {class: 'header'}, [
            $$(FontAwesomeIcon, {icon: 'fa-bullhorn'}),
            dropdownheader
        ])
    }

    /**
     * When selecting a content part type in a drop down list
     * Update `contentpartUri` property on the node
     * and change the component state to hide the dropdown
     * @param inlineText
     */
    selectInlineText(inlineText) {
        this.extendState({
            showInlineTextMenu: false,
            contentPartType: this.manager.getContentPartTypeByURI(inlineText.uri)
        })
        api.editorSession.transaction((tx) => {
            tx.set([this.props.node.id, 'contentpartUri'], inlineText.uri)
        })
    }

    toggleMenu() {
        this.extendState({showInlineTextMenu: !this.state.showInlineTextMenu})
    }
}

// Does this do anything?
ContentPartComponent.fullWidth = true

export default ContentPartComponent

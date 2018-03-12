import {ContainerEditor, StrongCommand, EmphasisCommand, SwitchTextCommand, Component, FontAwesomeIcon} from 'substance'
import {api} from 'writer'
import FileInputComponent from './FileInputComponent'
import RelatedArticlesComponent from './RelatedArticlesComponent'

class TeaserComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    willReceiveProps(newProps) {
        // When active Teaser changes, remove containerEditor if it exists.
        // ContainerEditor sets its containerId in the constructor, so it needs
        // to reinitialize completely when TeaserNode changes
        if(this.props.node.id !== newProps.node.id && this.refs.containerEditor) {
            this.refs.containerEditor.remove()
        }
    }

    /**
     * If teaser has imageFile, force rerender to avoid dead image on first render.
     * Also download metadata if needed
     *
     * @param change
     * @private
     */
    _onDocumentChange(change) {
        if (change.isAffected(this.props.node.id)) {
            this.rerender()
        } else if (change.isAffected(this.props.node.imageFile)) {
            this.rerender()
        }
    }

    render($$) {
        const el = $$('div').addClass('teaser-container').ref('teaserContainer')
        const types = api.getConfigValue('se.infomaker.ximteaser', 'types', [])
        const currentType = types.find(({type}) => type === this.props.node.dataType)
        const hasImage = this.props.node.imageFile
        const hasFields = currentType.fields && currentType.fields.length
        const hasRelatedArticles = this.props.node.relatedArticles && this.props.node.relatedArticles.length

        if (hasImage) {
            el.append(this._renderImageDisplay($$, currentType))
        }

        el.append(this._renderUploadContainer($$))

        if(hasFields) {
            el.append(this._renderEditorFields($$, currentType, hasImage))
        } else {
            el.append($$('span').append('No fields configured for teaser'))
        }

        if (hasRelatedArticles) {
            el.append(this._renderRelatedArticles($$))
        }

        return el
    }


    _renderEditorFields($$, currentType, hasImage) {
        return currentType.fields
            .filter(({id}) => id !== 'subject' || (hasImage && id === 'subject'))
            .map((field) => this._createCustomFieldIfUndefined(field))
            .map((field) => this._renderFieldByType($$, field))
    }

    /**
     * Delegates rendering to the appropriate method for each field type
     * @param  {function} $$ - Substance createElement
     * @param  {Field} field
     * @return {VirtualElement}
     */
    _renderFieldByType($$, field) {
        switch (field.type) {
            case 'datetime':
            case 'date':
            case 'time':
                return this._renderDatetimeFieldEditor($$, field)
            case 'text':
                return this._renderFieldEditor($$, field)
            default:
                return this._renderFieldEditor($$, field)
        }
    }

    _renderDatetimeFieldEditor($$, field) {
        const DatetimeFieldEditor = this.context.api.ui.getComponent('datetime-field-editor')
        const editorProps = {
            node: this.props.node,
            field: ['customFields', field.id],
            label: field.label,
            type: field.type
        }
        if (field.icon) { editorProps.icon = field.icon }

        return $$(DatetimeFieldEditor, editorProps).ref(`${field.id}FieldEditor`)
    }

    _renderFieldEditor($$, field) {
        if(Boolean(field.multiline) && field.id === 'text') {
            return this._renderContainerEditor($$, field)
        } else {
            const FieldEditor = this.context.api.ui.getComponent('field-editor')
            const editorProps = {
                node: this.props.node,
                multiLine: false,
                field: (this._isCustomField(field) ? ['customFields', field.id] : field.id),
                placeholder: field.label,
            }
            if (field.icon) { editorProps.icon = field.icon }

            return $$(FieldEditor, editorProps).ref(`${field.id}FieldEditor`)
        }
    }

    _renderContainerEditor($$) {
        return $$(ContainerEditor, {
            name: 'contentpartEditor' + this.props.node.id,
            containerId: this.props.node.id,
            textTypes: [],
            commands: [StrongCommand, EmphasisCommand, SwitchTextCommand]
        }).ref(`containerEditor`).addClass('contentpart-editor im-container-editor')
    }

    _renderImageDisplay($$, currentType) {
        const ImageDisplay = api.ui.getComponent('imageDisplay')
        // Manually disable byline for teaser image, to make sure it's not accidentally enabled through config
        const imageOptions = Object.assign(currentType.imageoptions, {
            byline: false,
            bylinesearch: false
        })

        return $$(ImageDisplay, {
            imageOptions,
            node: this.props.node,
            isolatedNodeState: this.props.isolatedNodeState,
            removeImage: this.removeImage.bind(this)
        })
            .ref('image')
            .on('click', () => {
                if(!this.props.isolatedNodeState) {
                    this.props.selectContainer()
                }
            })
    }

    _renderRelatedArticles($$) {
        return $$(RelatedArticlesComponent, {
            articles: this.props.node.relatedArticles,
            remove: (uuid) => {
                this.props.node.removeRelatedArticle(uuid)
            }
        })
    }

    /**
     * Since the extra fields are dynamic and are not created when the node is instanciated they
     * have to be created here
     * @param  {Field} field
     * @return {Field}
     */
    _createCustomFieldIfUndefined(field) {
        if (this._isCustomField(field) && typeof this.props.node.customFields[field.id] === 'undefined') {
            api.doc.set([this.props.node.id, 'customFields', field.id], '')
        }
        return field
    }

    _isCustomField(field) {
        const excludedElems = ['title', 'subject', 'text']
        return !excludedElems.includes(field.id)
    }

    triggerFileUpload(ev) {
        api.editorSession.executeCommand('ximteaser.insert-image', {
            data: {
                type: 'file',
                file: ev.target.files[0]
            },
            context: {node: this.props.node}
        })
    }

    /**
     * Set selection to container component, avoids selection errors
     * when Subject field is no longer rendered
     * Remove reference to fileNode from teaser node
     * Set subject property on teaser to null
     */
    removeImage() {
        this.props.selectContainer()
        api.editorSession.transaction((tx) => {
            const node = this.props.node
            tx.set([node.id, 'imageFile'], null)
            tx.set([node.id, 'subject'], '')
            tx.set([node.id, 'crops'], [])
        })
    }

    _renderUploadContainer($$) {
        const extensionModules = this.context.api.getPluginModulesForTarget(
            'se.infomaker.ximteaser'
        )
        const container = $$('div').addClass('x-im-teaser-upload-container')

        if(extensionModules && extensionModules.length > 0) {
            const title = this.props.node.imageFile ? 'teaser-replace-image' : 'teaser-add-image'
            container.append(
                $$('span')
                    .addClass('upload-button')
                    .append($$(FontAwesomeIcon, {icon: 'fa-image'}))
                    .attr('title', this.getLabel(title))
                    .on('click', () => {
                        this.openExtensionDialog(extensionModules[0])
                    })
            )
        } else {
            container.append(
                $$(FileInputComponent, {onChange: this.triggerFileUpload.bind(this)})
            )
        }

        return container
    }

    openExtensionDialog(extensionComponent) {
        const label = this.props.node.imageFile ? 'teaser-replace-image' : 'teaser-add-image'
        api.ui.showDialog(
            extensionComponent,
            {
                pluginNode: this.props.node,
                insertImageCommand: 'ximteaser.insert-image'
            },
            {
                title: this.getLabel(label),
                global: true,
                primary: this.getLabel('Save'),
                secondary: this.getLabel('Cancel'),
                cssClass: 'np-teaser-dialog hide-overflow'
            }
        )
    }
}
export default TeaserComponent

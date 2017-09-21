import {Component, TextPropertyEditor, FontAwesomeIcon} from 'substance'
import {api} from 'writer'
import FileInputComponent from './FileInputComponent'

class TeaserComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    /**
     * If teaser has imageFile, force rerender to avoid dead image.
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
            const imageNode = this.context.api.doc.get(this.props.node.imageFile)
            if (imageNode && imageNode.sourceUUID && this.props.node.shouldDownloadMetadataForImageUri) {
                this.props.node.fetchPayload(this.context, (err, node) => {
                    this.context.editorSession.transaction((tx) => {
                        tx.set([this.props.node.id, 'uuid'], imageNode.uuid)
                        tx.set([this.props.node.id, 'uri'], node.uri)
                        tx.set([this.props.node.id, 'width'], node.width)
                        tx.set([this.props.node.id, 'height'], node.height)
                        tx.set([this.props.node.id, 'crops'], [])
                    })
                    this.props.node.shouldDownloadMetadataForImageUri = false
                })
            }
        }
    }

    render($$) {
        const el = $$('div').addClass('teaser-container').ref('teaserContainer')
        const types = api.getConfigValue('se.infomaker.ximteaser2', 'types')
        const currentType = types.find(({type}) => type === this.props.node.dataType)

        const ImageDisplay = api.ui.getComponent('imageDisplay')
        if (this.props.node.imageFile) {
            // Manually disable byline for teaser image, to make sure it's not accidentally enabled through config
            const imageOptions = Object.assign(currentType.imageoptions, {
                byline: false,
                bylinesearch: false
            })

            el.append(
                $$(ImageDisplay, {
                    node: this.props.node,
                    isolatedNodeState: this.props.isolatedNodeState,
                    removeImage: this.removeImage.bind(this),
                    imageOptions
                }).ref('image')
            )
        }

        el.append(
            this._renderUploadContainer($$)
        )

        if(currentType.fields && currentType.fields.length) {

            const editorFields = currentType.fields.map((field) => {
                const fieldElement = $$('div').addClass('im-blocknode__content full-width x-im-teaser-field')
                const fieldInput = $$(TextPropertyEditor, {
                    path: [this.props.node.id, field.id],
                    doc: this.props.node.doc
                })
                    .addClass('x-im-teaser-input')
                    .ref(`${field.id}FieldEditor`)

                const icon = $$(FontAwesomeIcon, { icon: field.icon || 'fa-header' })
                    .attr('title', field.placeholder)
                    .addClass('x-im-teaser-icon')

                fieldElement.append([icon, fieldInput])

                return fieldElement
            })

            el.append(editorFields)
        } else {
            el.append($$('span').append('No fields configured for teaser'))
        }

        return el
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
     * Remove reference to fileNode from teaser node
     * Set subject property on teaser to null
     */
    removeImage() {
        api.editorSession.transaction((tx) => {
            const node = this.props.node
            tx.set([node.id, 'imageFile'], null)
            tx.set([node.id, 'subject'], '')
        })
    }

    _renderUploadContainer($$) {
        const extensionModules = this.context.api.getPluginModulesForTarget(
            'se.infomaker.ximteaser2'
        )
        const container = $$('div').addClass('x-im-teaser-upload-container')

        if(extensionModules && extensionModules.length > 0) {
            container.append(
                $$('span')
                    .addClass('upload-button')
                    .append($$(FontAwesomeIcon, {icon: 'fa-upload'}))
                    .attr('title', 'Extended thing')
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
        api.ui.showDialog(
            extensionComponent,
            {
                pluginNode: this.props.node,
                insertImageCommand: 'ximteaser.insert-image'
            },
            {
                title: 'Extended Upload Dialog',
                global: true,
                primary: this.getLabel('Save'),
                secondary: this.getLabel('Cancel'),
                cssClass: 'np-teaser-dialog'
            }
        )
    }

}
export default TeaserComponent
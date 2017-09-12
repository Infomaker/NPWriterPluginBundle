import {Component} from 'substance'
import {api} from 'writer'

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
            if (imageNode && imageNode.sourceUUID && this.shouldDownloadMetadataForImageUri) {
                this.props.node.fetchPayload(this.context, (err, node) => {
                    this.context.editorSession.transaction((tx) => {
                        tx.set([this.props.node.id, 'uri'], node.uri)
                        tx.set([this.props.node.id, 'width'], node.width)
                        tx.set([this.props.node.id, 'height'], node.height)
                        tx.set([this.props.node.id, 'crops'], [])
                    })
                    this.shouldDownloadMetadataForImageUri = false
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
            el.append(
                $$(ImageDisplay, { // Pass property to images if used in teaser and if drag should be disabled
                    parentId: 'se.infomaker.ximteaser2',
                    node: this.props.node,
                    imageOptions: currentType.imageoptions,
                    isolatedNodeState: this.props.isolatedNodeState,
                    removeImage: this.removeImage.bind(this)
                }).ref('image')
            )

        }

        const FieldEditor = api.ui.getComponent('field-editor')

        if(currentType.fields && currentType.fields.length) {
            const editorFields = currentType.fields.map((field) => {
                return $$(FieldEditor, {
                    node: this.props.node,
                    multiLine: field.multiline ? field.multiline : false,
                    field: field.id,
                    icon: field.icon,
                    placeholder: field.placeholder
                }).ref(`${field.id}FieldEditor`)
            })

            el.append(editorFields)
        } else {
            el.append($$('span').append('No fields configured for teaser'))
        }

        return el
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

}
export default TeaserComponent
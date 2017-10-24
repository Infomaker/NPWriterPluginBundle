import {Component} from 'substance'
import {fetchImageMeta} from 'writer'

class ImageGalleryImageComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    /**
     * If teaser has imageFile, force rerender to avoid dead image on first render.
     * Also download metadata if needed
     *
     * @param change
     * @private
     */
    _onDocumentChange(change) {
        if (change.isAffected(this.props.node.imageFile)) {
            const imageNode = this.context.api.doc.get(this.props.node.imageFile)
            fetchImageMeta(imageNode.uuid)
                .then((node) => {
                    this.context.editorSession.transaction((tx) => {
                        tx.set([this.props.node.id, 'caption'], node.caption)
                    })
                    this.rerender()
                })
        }
    }

    render($$) {
        const numberDisplay = $$('div').addClass('number-display')
        const itemWrapper = $$('div', {class: 'item-wrapper'})
        const imageWrapper = $$('div').addClass('image-wrapper')
        const imageNode = this.context.doc.get(this.props.node.imageFile)
        const imageEl = $$('img', {src: imageNode.getUrl()})

        const removeIcon = $$('i').addClass('remove-image fa fa-times')
            .on('click', this.props.remove)

        imageWrapper.append(imageEl)
        numberDisplay.append(this.props.index + 1)

        return itemWrapper
            .append(numberDisplay)
            .append(imageWrapper)
            .append(this.renderImageMeta($$))
            .append(removeIcon)
    }

    renderImageMeta($$) {
        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        const node = this.props.node
        const imageMeta = $$('div').addClass('image-meta')

        const bylineInput = $$(FieldEditor, {
            node,
            field: 'byline',
            placeholder: 'Byline',
            icon: 'fa-user'
        }).ref('bylineInput')

        const captionInput = $$(FieldEditor, {
            node,
            field: 'caption',
            placeholder: 'Bildtext',
            icon: 'fa-align-left'
        }).ref('captionInput')

        imageMeta.append(bylineInput, captionInput)

        return imageMeta
    }
}

export default ImageGalleryImageComponent

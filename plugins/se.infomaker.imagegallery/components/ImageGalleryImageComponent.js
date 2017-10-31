import {Component} from 'substance'
import {fetchImageMeta} from 'writer'

/**
 * @class ImageGalleryImageComponent
 * Image Component used by Image Gallery, renders image, caption, and byline
 * for image. When added it fetches metadata from image and populates
 * the ImageGalleryImageNode related to the component.
 *

 * @property {Object} props
 * @property {Number} props.index
 * @property {Node} props.node
 * @property {String} props.isolatedNodeState
 * @property {Function} props.remove
 */
class ImageGalleryImageComponent extends Component {

    didMount() {
        this.props.node.fetchAuthorsConcept()
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
                        if (node.authors.length > 0) {
                            tx.set([this.props.node.id, 'authors'], node.authors)
                        }
                    })
                    this.rerender()
                })
        } else if (change.isAffected([this.props.node.id, 'authors'])) {
            this.rerender()
        }
    }

    render($$) {
        const numberDisplay = $$('div').addClass('number-display')
        const itemWrapper = $$('div').addClass('item-wrapper')
            .attr('id', `index_${this.props.node.id}`)
            .ref('itemWrapper')
            .attr('data-drop-effect', 'move')

        const imageWrapper = $$('div').addClass('image-wrapper')
        const imageNode = this.context.doc.get(this.props.node.imageFile)
        const imageEl = $$('img', {src: imageNode.getUrl()})

        const removeIcon = $$('i').addClass('remove-image fa fa-times')
            .on('click', this.props.remove)

        imageWrapper.append(imageEl)
        numberDisplay.append(this.props.index + 1)

        itemWrapper.attr('draggable', true)
            .on('dragstart', (ev) => {
                ev.stopPropagation()

                ev.dataTransfer.setData('text/plain', this.props.node.id);
                this.props.dragStart()

                setTimeout(() => this.refs.itemWrapper.addClass('dragging'))
            })
            .on('dragover', (ev) => {
                ev.preventDefault()
                ev.stopPropagation()

                ev.dataTransfer.dropEffect = ev.target.getAttribute('data-drop-effect')

                const aboveOrBelow = ev.offsetY / ev.target.offsetHeight
                const itemWrap = this.refs.itemWrapper
                if (itemWrap.hasClass('add-below') && aboveOrBelow < 0.5) {
                    itemWrap.removeClass('add-below').addClass('add-above')
                } else if (itemWrap.hasClass('add-above') && aboveOrBelow > 0.5) {
                    itemWrap.addClass('add-below').removeClass('add-above')
                } else if (!itemWrap.hasClass('add-above') && !itemWrap.hasClass('add-below')) {
                    itemWrap.addClass(aboveOrBelow <= 0.5 ? 'add-above' : 'add-below')
                }
            })
            .on('dragenter', () => {
                this.refs.itemWrapper.addClass('drag-over')
            })
            .on('dragleave', () => {
                this.refs.itemWrapper.removeClass('drag-over')
                    .removeClass('add-above')
                    .removeClass('add-below')
            })
            .on('dragend', (ev) => {
                ev.preventDefault()
                ev.stopPropagation()

                this.props.dragEnd(ev)
                this.refs.itemWrapper.removeClass('dragging')
            })

        return itemWrapper
            .append(numberDisplay)
            .append(imageWrapper)
            .append(this.renderImageMeta($$))
            .append(removeIcon)
    }

    renderImageMeta($$) {
        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        const BylineComponent = this.context.api.ui.getComponent('byline')
        const node = this.props.node
        const imageMeta = $$('div').addClass('image-meta')

        const bylineInput = $$(BylineComponent, {
            node: this.props.node,
            isolatedNodeState: this.props.isolatedNodeState
        })

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

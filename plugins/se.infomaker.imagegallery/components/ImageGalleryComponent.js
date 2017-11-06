import {Component, FontAwesomeIcon, Button} from 'substance'
import {api, idGenerator} from 'writer'
import {INSERT_IMAGE_COMMAND, IMAGE_GALLERY_ICON} from '../ImageGalleryNode'
import dragStateDataExtractor from '../../se.infomaker.ximteaser/dragStateDataExtractor'
import ImageGalleryImageComponent from './ImageGalleryImageComponent'
import ImageGalleryPreviewComponent from './ImageGalleryPreviewComponent'

/**
 * @class ImageGalleryComponent
 * Image Gallery Component renders slider-preview, and image toolbox.
 * Contains nodes of ImageGalleryImageComponents.
 *

 * @property {Object} props
 * @property {Node} props.node
 * @property {Number} props.initialPosition Initial position for the gallery slider, useful for keeping position between renders
 * @property {string} props.isolatedNodeState
 * @property {Function} props.removeImage
 * @property {Function} props.onTransitionEnd Fires when the slider has finished an animation transition
 */
class ImageGalleryComponent extends Component {

    /**
     * Only rerender when not focused.
     * This avoids multiple author and image rerenders
     * from child components.
     *
     * @param newProps
     * @returns {boolean}
     */
    shouldRerender(newProps) {
        return newProps.isolatedNodeState !== 'focused'
    }

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    /**
     * @param change
     * @private
     */
    _onDocumentChange(change) {
        if (change.isAffected([this.props.node.id, 'nodes'])) {
            this.rerender()

            // Dropping an image on an unselected ImageGallery will select it
            if (!this.props.isolatedNodeState) {
                this._selectContainer()
            }
        }
    }

    render($$) {
        const el = $$('div')
            .addClass('im-blocknode__container im-image-gallery')
            .append(this._renderHeader($$))

        const FieldEditor = this.context.api.ui.getComponent('field-editor')

        if(this.props.node.length > 0) {
            const galleryPreview = $$(ImageGalleryPreviewComponent, {
                node: this.props.node,
                isolatedNodeState: this.props.isolatedNodeState,
                removeImage: this._removeImage.bind(this),
                initialPosition: this._storedGalleryPosition,
                onTransitionEnd: (pos) => {
                    this._storedGalleryPosition = pos
                }
            })

            el.append(galleryPreview)
        } else {
            const dropZoneText = $$('div').addClass('dropzone-text').append(this.getLabel('im-imagegallery.dropzone-label'))
            const dropzone = $$('div').addClass('image-gallery-dropzone').append(dropZoneText).ref('dropZone')

            el.append(dropzone)
        }

        const generericCaptionInput = $$(FieldEditor, {
            id: idGenerator(),
            node: this.props.node,
            field: 'genericCaption',
            placeholder: this.getLabel('im-imagegallery.generic-caption'),
            icon: 'fa-align-left'
        }).ref('generericCaptionInput')

        const genericCaptionWrapper = $$('div').addClass('image-gallery-genericcaption').append(generericCaptionInput)

        const imageGalleryToolbox = this._renderToolbox($$)

        return el.append(genericCaptionWrapper)
            .append(imageGalleryToolbox)
            .ref('imageGalleryComponent')
    }

    /**
     * @returns {Number}
     * @private
     */
    get _storedGalleryPosition() {
        return this._galleryPosition
    }

    /**
     * @param {Number} pos
     * @private
     */
    set _storedGalleryPosition(pos) {
        this._galleryPosition = pos
    }

    /**
     * @param $$
     * @returns {VirtualElement}
     * @private
     */
    _renderToolbox($$) {
        const imageGalleryToolbox = $$('div').addClass('image-gallery-toolbox').ref('toolBox')
        imageGalleryToolbox.append(this._renderHeader($$))
            .on('drop', this._onDrop)

        if (this.props.isolatedNodeState) {
            imageGalleryToolbox.addClass('show')

            if (this.props.node.nodes && this.props.node.nodes.length) {
                let toolboxContent = $$('div').addClass('toolboox-content')

                this.props.node.nodes.forEach((galleryImageNodeId, index) => {
                    const galleryImageNode = this.context.doc.get(galleryImageNodeId)
                    toolboxContent.append($$(ImageGalleryImageComponent, {
                        index,
                        node: galleryImageNode,
                        isolatedNodeState: this.props.isolatedNodeState,
                        remove: () => {
                            this._removeImage(galleryImageNodeId)
                        },
                        dragStart: () => {
                            // Add class which prevents interaction with toolbox input fields when dragging image components
                            this.refs.toolBox.addClass('drag-started')
                        },
                        dragEnd: () => {
                            // Remove class which prevents interaction with toolbox input fields when dragging image components
                            this.refs.toolBox.removeClass('drag-started')
                        }
                    }).ref(galleryImageNodeId))
                })

                imageGalleryToolbox.append(toolboxContent)
            }
        }

        return imageGalleryToolbox
    }

    /**
     * @param $$
     * @returns {VirtualElement}
     * @private
     */
    _renderHeader($$) {
        const imageCount = this.props.node.nodes ? this.props.node.nodes.length : 0
        const header = $$('div').addClass('image-gallery-header')
        const icon = $$(FontAwesomeIcon, {icon: IMAGE_GALLERY_ICON})
        const label = `${this.getLabel('im-imagegallery.image-gallery-name')} (${imageCount})`

        header.append(icon).append(label)

        return header
    }

    /**
     * @param galleryImageNodeId
     * @private
     */
    _removeImage(galleryImageNodeId) {
        const node = this.props.node
        this.context.editorSession.transaction(tx => {
            tx.set([node.id, 'nodes'], node.nodes.filter(childNode => childNode !== galleryImageNodeId))
            tx.delete(galleryImageNodeId)
        })
    }

    /**
     * @private
     */
    _selectContainer() {
        const comp = this.getParent()
        comp.extendState({mode: 'selected', unblocked: true})
        comp.selectNode()
    }

    getDropzoneSpecs() {
        return [{
            component: this,
            message: this.getLabel('im-imagegallery.dropzone-label'),
            dropParams: {
                action: 'imagegallery-add-image',
                nodeId: this.props.node.id,
            }
        }]
    }

    handleDrop(tx, dragState) {
        const dragData = dragStateDataExtractor.extractMultiple(dragState)
        api.editorSession.executeCommand(INSERT_IMAGE_COMMAND, {
            tx,
            context: {node: this.props.node},
            data: dragData
        })
    }

    /**
     * Handles dropped node event propagated from
     * an ImageGalleryImageComponent
     *
     * @param ev
     * @private
     */
    _onDrop(ev) {
        ev.preventDefault()
        ev.stopPropagation()

        const nodes = this.props.node.nodes
        const fromId = ev.dataTransfer.getData('text/plain')
        const toId = ev.target.id.split('_').pop()
        const addAfter = ev.target.classList.contains('add-below')

        if(!fromId) {
            return
        }

        const targetIndex = nodes.findIndex((nodeId) => nodeId === toId)
        const toIndex = addAfter ? targetIndex + 1 : targetIndex
        const fromIndex = nodes.findIndex((nodeId) => nodeId === fromId)
        nodes[fromIndex] = null
        nodes.splice(toIndex, 0, fromId)

        this.context.editorSession.transaction(tx => {
            tx.set([this.props.node.id, 'nodes'], nodes.filter(n => n))
        })

        this.refs[fromId].showDropSucceeded()

        // Tell the substance drag manager that the drag and drop is done
        this.context.dragManager.emit('drag:finished')
    }
}

export default ImageGalleryComponent

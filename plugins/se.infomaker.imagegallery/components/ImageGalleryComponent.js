import {Component, FontAwesomeIcon, Button} from 'substance'
import {api, idGenerator} from 'writer'
import {INSERT_IMAGE_COMMAND, IMAGE_GALLERY_ICON} from '../ImageGalleryNode'
import dragStateDataExtractor from '../../se.infomaker.ximteaser/dragStateDataExtractor'
import ImageGalleryImageComponent from './ImageGalleryImageComponent'

class ImageGalleryComponent extends Component {

    shouldRerender(newProps) {
        return newProps.isolatedNodeState !== 'focused'
    }

    didMount() {
        this.context.editorSession.onRender('document', this.onDocumentChange, this)
    }

    onDocumentChange(change) {
        if (change.isAffected([this.props.node.id, 'nodes'])) {
            this.rerender()
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
            const galleryPreview = this._renderGalleryPreview($$)

            el.append(galleryPreview)
        } else {
            const dropZoneText = $$('div').addClass('dropzone-text').append(this.getLabel('Dropzone label'))
            const dropzone = $$('div').addClass('image-gallery-dropzone').append(dropZoneText).ref('dropZone')

            el.append(dropzone)
        }

        const generericCaptionInput = $$(FieldEditor, {
            id: idGenerator(),
            node: this.props.node,
            disabled: false,
            multiLine: true,
            field: 'genericCaption',
            placeholder: this.getLabel('Generic caption'),
            icon: 'fa-align-left'
        }).ref('generericCaptionInput')

        const genericCaptionWrapper = $$('div').addClass('image-gallery-genericcaption').append(generericCaptionInput)

        const imageGalleryToolbox = this._renderToolbox($$)

        return el.append(genericCaptionWrapper)
            .append(imageGalleryToolbox)
            .ref('imageGalleryComponent')
    }

    /**
     * @param $$
     * @returns {VirtualElement}
     * @private
     */
    _renderToolbox($$) {
        const imageGalleryToolbox = $$('div').addClass('image-gallery-toolbox')
        imageGalleryToolbox.append(this._renderHeader($$))

        if (this.props.isolatedNodeState) {
            imageGalleryToolbox.addClass('show')

            if (this.props.node.nodes && this.props.node.nodes.length) {
                let toolboxContent = $$('div').addClass('toolboox-content')

                this.props.node.nodes.forEach((galleryImageNodeId, index) => {
                    const galleryImageNode = this.context.doc.get(galleryImageNodeId)
                    toolboxContent.append($$(ImageGalleryImageComponent, {
                        index,
                        node: galleryImageNode,
                        remove: () => {
                            this._removeImage(galleryImageNodeId)
                        },
                        isolatedNodeState: this.props.isolatedNodeState
                    }))
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
        const label = `${this.getLabel('Image gallery')} (${imageCount})`

        header.append(icon).append(label)

        return header
    }

    /**
     * @param $$
     * @returns {VirtualElement}
     * @private
     */
    _renderGalleryPreview($$) {
        const InlineImageComponent = api.ui.getComponent('InlineImageComponent')
        const galleryPreview = $$('div').addClass('image-gallery-gallery')
        const galleryImages = this.props.node.nodes.map((galleryImageNodeId) => {
            const galleryImageNode = this.context.doc.get(galleryImageNodeId)
            const imageContainer = $$('div').addClass('image-container')

            const deleteButton = $$(Button, {icon: 'remove'})
                .addClass('remove-image-button')
                .attr('title', this.getLabel('remove-image-button-title'))
                .on('click', () => {
                    this._removeImage(galleryImageNodeId)
                })
            imageContainer.append(deleteButton)

            return imageContainer
                .append(
                    $$(InlineImageComponent, {
                        nodeId: galleryImageNode.imageFile
                    })
                )
        })
        galleryPreview.append(galleryImages)

        return galleryPreview
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
            message: this.getLabel('Dropzone label'),
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
}

export default ImageGalleryComponent

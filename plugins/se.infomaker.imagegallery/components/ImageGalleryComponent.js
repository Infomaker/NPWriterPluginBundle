import {Component, FontAwesomeIcon} from 'substance'
import {api, idGenerator, UIFieldEditor, UIDialogImage, UIImageCropper} from 'writer'
import {INSERT_IMAGE_COMMAND, IMAGE_GALLERY_ICON} from '../ImageGalleryNode'
import dragStateDataExtractor from '../../se.infomaker.ximteaser/dragStateDataExtractor'
import ImageGalleryImageComponent from './ImageGalleryImageComponent'
import ImageGalleryPreviewComponent from './ImageGalleryPreviewComponent'

/**
 * @class ImageGalleryComponent
 * @description
 * Image Gallery Component renders slider-preview, and image toolbox.
 * Contains nodes of ImageGalleryImageComponents.
 *
 * @property {object}   props
 * @property {node}     props.node
 * @property {number}   props.initialPosition Initial position for the gallery slider, useful for keeping position between renders
 * @property {string}   props.isolatedNodeState
 * @property {function} props.removeImage
 * @property {function} props.onTransitionEnd Fires when the slider has finished an animation transition
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
    shouldRerender(newProps, newState) {
        return (
            newProps.isolatedNodeState !== 'focused' ||
            newState.showImageCrop !== this.state.showImageCrop ||
            newState.galleryImageNode !== this.state.galleryImageNode ||
            newState.galleryImageNodeSrc !== this.state.galleryImageNodeSrc ||
            newState.medataButtonClicked !== this.state.medataButtonClicked
        )
    }

    getInitialState () {
        return {
            showImageCrop: false,
            metadataButtonClicked: false,
            galleryImageNode: null,
            galleryImageNodeSrc: null,
        }
    }


    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this.context.editorSession.off(this)
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
        const {showImageCrop, metadataButtonClicked} = this.state

        const el = $$('div')
            .addClass('im-blocknode__container im-image-gallery')
            .append(this._renderHeader($$))

        if (showImageCrop) {
            el.append(
                $$('div', { class: 'cropper-overlay' },
                    this._renderCropper($$)
                )
            )
        }

        if (this.props.node.length > 0) {
            el.append($$(ImageGalleryPreviewComponent, {
                node: this.props.node,
                isolatedNodeState: this.props.isolatedNodeState,
                cropsEnabled: this._cropsEnabled,
                imageInfoEnabled: this._imageInfoEnabled,
                removeImage: this._removeImage.bind(this),
                initialPosition: this._storedGalleryPosition,
                downloadEnabled: this._downloadEnabled,
                onCropsClick: (galleryImageNode) => {

                    this._fetchCrops(galleryImageNode).then(src => {
                        this.extendState({
                            showImageCrop: true,
                            galleryImageNode,
                            galleryImageNodeSrc: src,
                        })
                    })
                },
                onInfoClick: (galleryImageNode) => {
                    if (!metadataButtonClicked) {
                        this.extendState({metadataButtonClicked: true})
                        this._openMetaData(galleryImageNode)
                    }
                },
                onDownloadClick: (galleryImageNode) => {
                    this._downloadImage(galleryImageNode)
                },
                onTransitionEnd: (pos) => {
                    this._storedGalleryPosition = pos
                }
            }))
        } else {
            const dropZoneText = $$('div').addClass('dropzone-text').append(this.getLabel('im-imagegallery.dropzone-label'))
            const dropzone = $$('div').addClass('image-gallery-dropzone').append(dropZoneText).ref('dropZone')

            el.append(dropzone)
        }

        const generericCaptionInput = $$(UIFieldEditor, {
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
     * Gets crops value from configuration
     *
     * @returns {Array}
     * @private
     */
    get _configuredCrops() {
        return this.context.api.getConfigValue('se.infomaker.imagegallery', 'crops', [])
    }

    /**
     * Gets cropsEnabled value from configuration
     *
     * @returns {boolean}
     * @private
     */
    get _cropsEnabled() {
        return this.context.api.getConfigValue('se.infomaker.imagegallery', 'cropsEnabled', false)
    }

    /**
     * Gets imageInfoEnabled value from configuration
     *
     * @returns {*}
     * @private
     */
    get _imageInfoEnabled() {
        return this.context.api.getConfigValue('se.infomaker.imagegallery', 'imageInfoEnabled', false)
    }

    get _hideDisableCropsCheckbox() {
        return this.context.api.getConfigValue('se.infomaker.imagegallery', 'hideDisableCropsCheckbox', false)
    }

    get _downloadEnabled() {
        return this.context.api.getConfigValue('se.infomaker.imagegallery', 'downloadEnabled', false)
    }

    /**
     * @param $$
     * @returns {VirtualElement}
     * @private
     */
    _renderToolbox($$) {
        const imageGalleryToolbox = $$('div').addClass('image-gallery-toolbox')
            .append(this._renderHeader($$))
            .ref('toolBox')
            .on('dragover', (ev) => ev.preventDefault())
            .on('drop', this._onDrop)

        const toolboxContent = $$('div').addClass('toolboox-content').ref('toolboxContent')
        this.props.node.nodes.forEach((galleryImageNodeId, index) => {
            const galleryImageNode = this.context.doc.get(galleryImageNodeId)
            toolboxContent.append($$(ImageGalleryImageComponent, {
                index,
                node: galleryImageNode,
                isolatedNodeState: this.props.isolatedNodeState,
                cropsEnabled: this._cropsEnabled,
                imageInfoEnabled: this._imageInfoEnabled,
                configuredCrops: this._configuredCrops,
                hideDisableCropsCheckbox: this._hideDisableCropsCheckbox,
                downloadEnabled: this._downloadEnabled,
                remove: () => {
                    this._removeImage(galleryImageNodeId)
                },
                onCropClick: () => {
                    this._fetchCrops(galleryImageNode).then(src => {
                        this.extendState({
                            showImageCrop: true,
                            galleryImageNode,
                            galleryImageNodeSrc: src,
                        })
                    })
                },
                onInfoClick: () => {
                    if (!this.state.metadataButtonClicked) {
                        this.extendState({metadataButtonClicked: true})
                        this._openMetaData(galleryImageNode)
                    }
                },
                onDownloadClick: () => {
                    this._downloadImage(galleryImageNode)
                }
            }).ref(galleryImageNode.id))
        })

        imageGalleryToolbox.append(toolboxContent)

        if (this.props.isolatedNodeState) {
            imageGalleryToolbox.addClass('show')
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

    _fetchCrops(galleryImageNode) {
        return galleryImageNode.fetchSpecifiedUrls(['service', 'original'])
            .catch(err => {
                this.extendState({
                    galleryImageNode: null,
                    galleryImageNodeSrc: null,
                    showImageCrop: false
                })

                console.error(err)
                api.ui.showMessageDialog([{
                    type: 'error',
                    message: `${this.getLabel('The image doesn\'t seem to be available just yet. Please wait a few seconds and try again.')}\n\n${err}`
                }])
            })
    }

    _renderCropper($$) {
        const {galleryImageNode, galleryImageNodeSrc} = this.state
        const apa = false

        if (galleryImageNode && galleryImageNodeSrc) {
            return $$(UIImageCropper, {
                parentId: galleryImageNode,
                src: galleryImageNodeSrc,
                configuredCrops: this._configuredCrops,
                width: galleryImageNode.width,
                height: galleryImageNode.height,
                crops: galleryImageNode.crops.crops || [],
                disableAutomaticCrop: galleryImageNode.disableAutomaticCrop,
                hideDisableCropsCheckbox: this._hideDisableCropsCheckbox,
                abort: () => {
                    this.extendState({
                        galleryImageNode: null,
                        galleryImageNodeSrc: null,
                        showImageCrop: false
                    })
                },
                restore: () => {
                    galleryImageNode.setSoftcropData([])

                    this.extendState({
                        galleryImageNode: null,
                        galleryImageNodeSrc: null,
                        showImageCrop: false
                    })
                },
                save: (newCrops, disableAutomaticCrop) => {
                    galleryImageNode.setSoftcropData(newCrops, disableAutomaticCrop)

                    this.extendState({
                        galleryImageNode: null,
                        galleryImageNodeSrc: null,
                        showImageCrop: false
                    })
                }
            })
        } else {
            return $$('div', { class: 'loading-previews-spinner' },
                $$('i', { class: 'fa fa-cog fa-spin' })
            )
        }
    }

    /**
     * Show image meta data in a modal dialog
     *
     * @memberOf ImageGalleryComponent
     * @param galleryImageNode
     * @private
     */
    _openMetaData(galleryImageNode) {
        const imageNode = this.context.api.doc.get(galleryImageNode.imageFile)

        api.router.getNewsItem(imageNode.uuid, 'x-im/image')
            .then(response => {

                this.extendState({metadataButtonClicked: false})

                api.ui.showDialog(
                    UIDialogImage,
                    {
                        node: imageNode,
                        url: imageNode.getUrl(),
                        newsItem: response,
                        disablebylinesearch: false,
                        focusOnRender: true
                    },
                    {
                        title: this.getLabel('Image archive information'),
                        global: true,
                        primary: this.getLabel('Save'),
                        secondary: this.getLabel('Cancel'),
                        cssClass: 'np-image-dialog hide-overflow',
                        focusPrimary: false
                    }
                )
            })
            .catch(() => {
                this.extendState({
                    openInfo: false
                })
            })
    }


    /**
     * Download original image via image node trait.
     *
     * @memberOf ImageGalleryComponent
     * @param galleryImageNode
     * @private
     */
    _downloadImage(galleryImageNode) {
        if (galleryImageNode.downloadOriginalImage) {
            galleryImageNode.downloadOriginalImage()
        } else {
            console.warn('Failed to download original image. Node missing download function')
        }
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

        if (!fromId) {
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
        this.context.dragManager.dragState = null
    }
}

export default ImageGalleryComponent

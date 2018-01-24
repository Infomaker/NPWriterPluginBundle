import {Component} from 'substance'

/**
 * @class ImageGalleryImageComponent
 * Image Component used by Image Gallery, renders image, caption, and byline
 * for image. When added it fetches metadata from image and populates
 * the ImageGalleryImageNode related to the component.
 *
 * @property {object}   props
 * @property {number}   props.index
 * @property {node}     props.node
 * @property {string}   props.isolatedNodeState
 * @property {boolean}  props.cropsEnabled
 * @property {function} props.remove
 * @property {function} props.dragStart
 * @property {function} props.dragEnd
 * @property {function} props.onCropClick
 */
class ImageGalleryImageComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    /**
     * Force rerender to avoid dead image on first render.
     * Also download metadata if needed
     *
     * @param change
     * @private
     */
    _onDocumentChange(change) {
        if (change.isAffected([this.props.node.id, 'authors'])) {
            this.rerender()
        }
    }

    render($$) {
        const InlineImageComponent = this.context.api.ui.getComponent('InlineImageComponent')
        const numberDisplay = $$('div').addClass('number-display')
        const itemWrapper = $$('div').addClass('item-wrapper')
            .ref('itemWrapper')
            .attr('data-drop-effect', 'move')
            .attr('draggable', false)

        const imageWrapper = $$('div').addClass('image-wrapper')
        const imageEl = $$(InlineImageComponent, {nodeId: this.props.node.imageFile}).attr('draggable', false)
        const imageControls = this._renderImageControls($$)

        imageWrapper.append(imageEl)
        numberDisplay.append(this.props.index + 1)

        // When clicking on dragAnchor, set draggable on itemWrapper
        // effectively dragging the wrapper using one of its child elements
        const dragAnchor = $$('div')
            .html(this._getSvg())
            .addClass('drag-me')
            .on('mousedown', () => this.refs.itemWrapper.attr('draggable', true))
            .on('mouseup', () => this.refs.itemWrapper.attr('draggable', false))

        itemWrapper
            .attr('id', `index_${this.props.node.id}`)
            .attr('draggable', false)
            .on('dragenter', this._dragEnter)
            .on('dragleave', this._dragLeave)
            .on('dragover', this._dragOver)
            .on('dragstart', this._dragStart)
            .on('dragend', this._dragEnd)

        return itemWrapper
            .append(dragAnchor)
            .append(numberDisplay)
            .append(imageWrapper)
            .append(this._renderImageMeta($$))
            .append(imageControls)
    }

    /**
     * @param $$
     * @returns {VirtualElement}
     * @private
     */
    _renderImageControls($$) {
        const imageControls = $$('div').addClass('image-controls')

        if (this.props.cropsEnabled === true) {
            const configuredCrops = this.props.configuredCrops
            let currentCrops = 0
            let cropBadgeClass = false

            if (this.props.node.crops && Array.isArray(this.props.node.crops.crops)) {
                currentCrops = this.props.node.crops.crops.length
            }

            const definedCrops = (Array.isArray(configuredCrops)) ? configuredCrops.length : Object.keys(configuredCrops).length
            if (currentCrops < definedCrops) {
                cropBadgeClass = 'se-warning'
            }

            imageControls.append([
                $$('b').append(currentCrops)
                    .addClass('image-control crop-badge')
                    .addClass(cropBadgeClass)
                    .attr('title', `${currentCrops}/${definedCrops} ${this.getLabel('crops defined')}`),
                $$('i').addClass('image-control fa fa-crop')
                    .attr('title', this.getLabel('crop-image-button-title'))
                    .on('click', this.props.onCropClick)
            ])
        }

        if (this.props.imageInfoEnabled === true) {
            imageControls.append(
                $$('i').addClass('image-control fa fa-info')
                    .attr('title', this.getLabel('Image archive information'))
                    .on('click', this.props.onInfoClick)
            )
        }

        imageControls.append(
            $$('i').addClass('image-control remove-image fa fa-times')
                .attr('title', this.getLabel('remove-image-button-title'))
                .on('click', this.props.remove)
        )


        return imageControls
    }

    /**
     * @private
     */
    _dragEnter() {
        this.refs.itemWrapper.addClass('drag-over')
    }

    /**
     * @private
     */
    _dragLeave() {
        this.refs.itemWrapper.removeClass('drag-over')
            .removeClass('add-above')
            .removeClass('add-below')
    }

    /**
     * @param ev
     * @private
     */
    _dragOver(ev) {
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
    }

    /**
     * @param ev
     * @private
     */
    _dragStart(ev) {
        ev.stopPropagation()
        ev.dataTransfer.setData('text/plain', this.props.node.id)

        this.props.dragStart()

        // Preserve style of dragged element, but style of element still in DOM
        setTimeout(() => this.refs.itemWrapper.addClass('dragging'))
    }

    /**
     * @param ev
     * @private
     */
    _dragEnd(ev) {
        ev.preventDefault()
        ev.stopPropagation()

        this.props.dragEnd(ev)
        this.refs.itemWrapper.removeClass('dragging')
    }

    /**
     * @param $$
     * @returns {VirtualElement}
     * @private
     */
    _renderImageMeta($$) {
        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        const BylineComponent = this.context.api.ui.getComponent('BylineComponent')
        const node = this.props.node
        const imageMeta = $$('div').addClass('image-meta')

        const bylineInput = $$(BylineComponent, {
            node: this.props.node,
            bylineSearch: true,
            isolatedNodeState: this.props.isolatedNodeState
        }).ref('byline')

        const captionInput = $$(FieldEditor, {
            node,
            field: 'caption',
            placeholder: this.getLabel('im-imagegallery.caption-placeholder'),
            icon: 'fa-align-left'
        }).ref('captionInput')

        imageMeta.append(bylineInput, captionInput)

        return imageMeta
    }

    showDropSucceeded() {
        const wrapper = this.refs.itemWrapper.el
        wrapper.el.scrollIntoViewIfNeeded()
        wrapper.addClass('drop-succeeded')
        setTimeout(() => wrapper.removeClass('drop-succeeded'), 700)
    }

    /**
     * TODO: Probably use an icon when available...
     *
     * @returns {string}
     * @private
     */
    _getSvg() {
        return '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"> <g> <rect x="7.9" y="1" class="st0" width="2.8" height="22"/> <rect x="13.4" y="1" class="st0" width="2.8" height="22"/> </g> </svg>'
    }
}

export default ImageGalleryImageComponent

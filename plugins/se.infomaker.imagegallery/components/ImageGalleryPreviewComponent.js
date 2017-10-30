import {Component, Button} from 'substance'

/**
 * @class ImageGalleryPreviewComponent
 * Spinning Image Gallery Preview.
 *

 * @property {Object} props
 * @property {Node} props.node
 * @property {Number} props.initialPosition Initial position for the gallery slider, useful for keeping position between renders
 * @property {string} props.isolatedNodeState
 * @property {Function} props.removeImage
 * @property {Function} props.onTransitionEnd Fires when the slider has finished an animation transition
 */
class ImageGalleryPreviewComponent extends Component {

    render($$) {
        const InlineImageComponent = this.context.api.ui.getComponent('InlineImageComponent')
        const galleryContainer = $$('div').addClass('image-gallery-container').ref('galleryContainer')

        // Sets average width depending on amount of nodes, we don't know the actual width at this point
        const galleryPreview = $$('div').addClass('image-gallery-gallery')
            .css({width: `${this.props.node.nodes.length * 250}px`})
            .on('transitionend', this._onTransitionEnd)
            .ref('galleryPreview')

        // Only render controls when gallery is selected
        if (this.props.isolatedNodeState) {
            const galleryControls = this._renderControls($$)
            galleryContainer.append(galleryControls)
        }

        if (this.props.initialPosition) {
            galleryPreview.css({left: `${this.props.initialPosition}px`})
        }

        const galleryImages = this.props.node.nodes.map((galleryImageNodeId) => {
            const galleryImageNode = this.context.doc.get(galleryImageNodeId)
            const imageContainer = $$('div').addClass('image-container')

            const deleteButton = $$(Button, {icon: 'remove'})
                .addClass('remove-image-button')
                .attr('title', this.getLabel('remove-image-button-title'))
                .on('click', () => {
                    this.props.removeImage(galleryImageNodeId)
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

        return galleryContainer.append(galleryPreview)
    }

    /**
     * Gets current value for the gallery's current left position.
     *
     * @returns {Number}
     */
    get leftPosition() {
        return parseInt(this.refs.galleryPreview.css('left'), 10)
    }

    /**
     * Gets the furthest right point of the gallery, formatted as left position
     *
     * @returns {number}
     */
    get maxLeftPosition() {
        const galleryWidth = this.refs.galleryContainer.el.getWidth()
        const rightButtonWidth = 24

        return -(Math.floor(this.summedNodeWith - galleryWidth)) - rightButtonWidth
    }

    get summedNodeWith() {
        const margin = 2
        return this.refs.galleryPreview.getChildNodes().reduce((res, child) => {
            res += child.el.getWidth() + margin
            return res
        }, 0)
    }

    get lock() {
        return this._lock
    }

    set lock(lock) {
        this._lock = lock
    }

    /**
     * Disabled clicking on control buttons when
     * gallery is transitioning
     *
     * @private
     */
    _lockControls() {
        this.lock = true
    }

    /**
     * Unlock control buttons when transition ends
     *
     * @private
     */
    _onTransitionEnd() {
        this.lock = false
        if(this.props.onTransitionEnd) {
            this.props.onTransitionEnd(this.leftPosition)
        }
    }

    /**
     * Renders the arrow controls for gallery.
     *
     * @param $$
     * @returns {[null,null]}
     * @private
     */
    _renderControls($$) {
        const stepSizePx = 300
        return [
            $$(Button, {icon: 'angle-left'})
                .addClass('gallery-control left-control')
                .on('click', () => {
                    if (this.lock || this.leftPosition === 0) {
                        return
                    }

                    const newLeftPos = this.leftPosition + stepSizePx >= 0 ? 0 : this.leftPosition + stepSizePx

                    this._lockControls()
                    this.refs.galleryPreview.css({
                        left: `${newLeftPos}px`
                    })
                })
                .ref('leftControl'),

            $$(Button, {icon: 'angle-right'})
                .addClass('gallery-control right-control')
                .on('click', () => {
                    const maxLeftPos = this.maxLeftPosition
                    if (this.lock || this.leftPosition <= maxLeftPos) {
                        return
                    }

                    const newLeftPos = this.leftPosition - stepSizePx <= maxLeftPos ? maxLeftPos : this.leftPosition - stepSizePx

                    this._lockControls()
                    this.refs.galleryPreview.css({
                        left: `${newLeftPos}px`
                    })
                })
                .ref('rightControl')
        ]
    }
}

export default ImageGalleryPreviewComponent
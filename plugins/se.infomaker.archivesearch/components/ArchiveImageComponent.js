import {Component} from 'substance'

class ArchiveImageComponent extends Component {

    render($$) {

        const {thumbnail, caption, uuid} = this.props.item

        if (!thumbnail) {
            return this._renderMissingImage($$)
        }

        return $$('div').addClass('image-thumb').append(
            $$('div').addClass('thumb-wrapper').append(
                $$('img', {
                    src: thumbnail || null
                }).attr('alt', caption)
            )
        )
            .attr({
                'draggable': true,
                'id': `archive-img-${uuid}`
            })
            .ref('imageThumb')
            .on('dragstart', this._onDragStart)
            .on('click', this._onClick)
    }

    /**
     * Preview image is missing, render a generic
     * image placeholder instead
     *
     * @param $$
     * @private
     */
    _renderMissingImage($$) {
        return $$('div').addClass('image-thumb').append(
            $$('div').addClass('thumb-wrapper broken-image')
        )
            .attr({
                'draggable': false,
                'id': `archive-img-${this.props.item.uuid}`,
                'title': this.getLabel('Missing image')
            })
            .on('click', this._onClick)
            .ref('imageThumb')
    }

    /**
     * @param {DragEvent} e
     * @private
     */
    _onDragStart(e) {
        e.stopPropagation()

        if (this.props.type === 'editorial-opencontent') {

            const dropData = getDroplinkForItem({uuid: this.props.item.uuid, name: this.props.item.caption})

            e.dataTransfer.setData('text/uri-list', dropData)

        } else {

            const dropData = {
                uuid: this.props.item.uuid,
                url: this.props.item.url,
                credit: this.props.item.credit ? this.props.item.credit : '',
                caption: this.props.item.caption ? this.props.item.caption.trim() : ''
            }

            e.dataTransfer.setData('text/uri-list', `x-im-archive-url://x-im/image?data=${encodeURIComponent(JSON.stringify(dropData))}`)
        }
    }

    /**
     * @param {MouseEvent} e
     * @private
     */
    _onClick(e) {
        e.preventDefault()
        const target = e.target
        this.props.onClick({
            item: this.props.item,
            position: {
                top: target.offsetTop + target.offsetHeight,
                left: target.offsetLeft + (target.offsetWidth / 2)
            }
        })
    }
}

function getDroplinkForItem(image) {
    const data = {
        imType: 'image',
        uuid: image.uuid,
        name: image.name
    }
    const dropData = encodeURIComponent(JSON.stringify(data))

    return `x-im-entity://x-im/image?data=${dropData}`
}


export default ArchiveImageComponent

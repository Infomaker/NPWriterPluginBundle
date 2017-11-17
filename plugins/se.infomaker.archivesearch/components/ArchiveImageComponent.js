import {Component} from 'substance'

class ArchiveImageComponent extends Component {

    render($$) {
        return $$('div').addClass('image-thumb')
            .append(
                $$('img', {
                    src: this.props.item.thumbnail
                }).attr('alt', this.props.item.caption)
            )
            .attr({
                'draggable': true,
                'id': `archive-img-${this.props.item.uuid}`
            })
            .ref('imageThumb')
            .on('dragstart', this._onDragStart)
            .on('click', this._onClick)
    }

    /**
     * @param {DragEvent} e
     * @private
     */
    _onDragStart(e) {
        e.stopPropagation()

        const dropData = {
            uuid: this.props.item.uuid,
            url: this.props.item.url,
            credit: this.props.item.credit ? this.props.item.credit : '',
            caption: this.props.item.caption ? this.props.item.caption : ''
        }

        e.dataTransfer.setData('text/uri-list', `x-im-archive-url://x-im/image?data=${encodeURIComponent(JSON.stringify(dropData))}`)
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

export default ArchiveImageComponent

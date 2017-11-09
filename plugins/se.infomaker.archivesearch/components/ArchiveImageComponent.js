import {Component} from 'substance'

class ArchiveImageComponent extends Component {

    render($$) {
        return $$('div').addClass('image-thumb')
            .append(
                $$('img', {
                    src: this.props.item.thumbnail
                }).attr('alt', this.props.item.Caption)
            )
            .attr({
                'draggable': true,
                'id': `archive-img-${this.props.item.uuid}`
            })
            .ref('imageThumb')
            .on('dragstart', this._onDragStart)
    }

    _onDragStart(e) {
        e.stopPropagation()

        const data = {
            uuid: this.props.item.uuid,
            author: this.props.item.Authors ? this.props.item.Authors : '',
            caption: this.props.item.Caption ? this.props.item.Caption : ''
        }

        e.dataTransfer.setData('text/uri-list', `x-im-archive-entity://x-im/image?data=${encodeURIComponent(JSON.stringify(data))}`)
    }

}

export default ArchiveImageComponent
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
            url: this.props.item.url,
            credit: this.props.item.credit ? this.props.item.credit : '',
            caption: this.props.item.caption ? this.props.item.caption : ''
        }

        e.dataTransfer.setData('text/uri-list', `x-im-archive-entity://x-im/image?data=${encodeURIComponent(JSON.stringify(data))}`)
    }

}

export default ArchiveImageComponent
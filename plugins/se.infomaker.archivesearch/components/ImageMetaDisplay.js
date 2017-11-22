import {Component} from 'substance'
import {moment} from 'writer'

import '../scss/imageMetaDialog.scss'

class ImageMetaDisplay extends Component {

    render($$) {
        return $$('div').addClass('image-meta-display')
            .append(
                this._renderImage($$),
                this._renderImageInfo($$)
            )
    }

    /**
     * @param $$
     * @returns {VirtualElement}
     * @private
     */
    _renderImageInfo($$) {
        const imageItem = this.props.imageItem

        return $$('div').addClass('image-info')
            .append(
                $$('div').addClass('description').append(
                    $$('h2').append(imageItem.description),
                    $$('p').append(imageItem.caption)
                ),
                this._renderImageMetaList($$)
            )
    }

    /**
     * @param $$
     * @returns {VirtualElement}
     * @private
     */
    _renderImageMetaList($$) {
        const imageItem = this.props.imageItem
        const items = [
            {label: 'UUID', key: 'uuid'},
            {label: this.getLabel('Source'), key: 'source'},
            {label: this.getLabel('Credit'), key: 'credit'},
            {label: this.getLabel('Photo Date'), key: 'photoDate', format: (value) => moment(value).format('YYYY-MM-DD')},
            {label: this.getLabel('Name'), key: 'name'}
        ]

        return $$('div').addClass('meta-list').append(
            $$('ul').append(
                items.filter((item) => imageItem[item.key])
                    .map((item) => {
                        const value = item.format ? item.format(imageItem[item.key]) : imageItem[item.key]
                        return $$('li').append(
                            $$('span').append(item.label),
                            $$('span').append(value)
                        )
                    })
            )
        )
    }

    /**
     * @param $$
     * @returns {VirtualElement}
     * @private
     */
    _renderImage($$) {
        return $$('div').addClass('image').append(
            $$('img', {
                src: this.props.imageItem.url
            })
        )
    }

    /**
     * @returns {boolean}
     * @private
     */
    onClose() {
        return true
    }
}

export default ImageMetaDisplay
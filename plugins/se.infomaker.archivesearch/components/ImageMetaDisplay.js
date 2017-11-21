import {Component} from 'substance'
import {moment} from 'writer'

import '../scss/imageMetaDialog.scss'

class ImageMetaDisplay extends Component {

    render($$) {

        console.log(this.props.imageItem)

        return $$('div').addClass('image-meta-display')
            .append(
                this._renderImage($$),
                this._renderImageInfo($$)
            )
    }

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

    _renderImageMetaList($$) {
        const imageItem = this.props.imageItem
        const items = [
            {label: 'UUID', key: 'uuid'},
            {label: 'Bild', key: 'credit'},
            {label: 'Fotodatum', key: 'photoDate', format: (value) => moment(value).format('YYYY-MM-DD')},
            {label: 'Tillskrivning', key: 'credit'},
            {label: 'Objektnamn', key: 'name'}
            // ,{label: 'Bredd x höjd'}
        ]

        return $$('div').addClass('meta-list').append($$('ul').append(
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

    _renderImage($$) {
        return $$('div').addClass('image').append(
            $$('img', {
                src: this.props.imageItem.url
            })
        )
    }

    onClose() {
        return true
    }
}

export default ImageMetaDisplay
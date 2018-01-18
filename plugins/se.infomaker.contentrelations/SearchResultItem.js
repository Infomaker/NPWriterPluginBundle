import {Component, FontAwesomeIcon} from 'substance'
import {api} from 'writer'

class SearchResultItem extends Component {

    getInitialState() {
        return {
            imageLoaded: false,
            imageURL: ''
        }
    }

    render($$) {
        const item = this.props.item
        const imType = item.imType ? item.imType[0] : 'article'

        return this._getItem($$, item, imType)
    }

    _getDroplinkForItem(item) {
        const imType = item.imType[0]
        const name = item.name[0]

        let data = {
            uuid: item.uuid,
            imType: imType,
            name: name
        }
        let dropData = encodeURIComponent(JSON.stringify(data))

        switch (imType) {
            case 'article':
                return `x-im-entity://x-im/article?data=${dropData}`
            case 'image':
                return `x-im-entity://x-im/image?data=${dropData}`
            default:
                return `x-im-entity://x-im/article?data=${dropData}`
        }
    }

    /**
     * @param $$
     * @param {object} item
     * @returns {*}
     * @private
     */
    _getProducts($$, item) {
        let products = item.type,
            productsType = item.typeCatalog ? item.typeCatalog[0] : 'text'

        let result = $$('div')
            .addClass('im-cr-products')

        let n = 0
        if (productsType && productsType === 'icon' && products) {
            const icons = products.map(function(product) {
                n++
                return $$('img')
                    .attr('src', product)
                    .addClass('product-icon')
                    .attr('alt', '')
            })

            icons.forEach(function(icon) {
                result.append(icon)
            })
        } else if (products) {
            result.append(products.join(', '))
        }

        return n ? result : null
    }

    _onDragStart(e) {
        e.stopPropagation()
        e.dataTransfer.setData('text/uri-list', this._getDroplinkForItem(this.props.item))
    }

    _getItem($$, item, type) {
        const drag = $$('div')
            .addClass('im-cr-drag')
            .attr('draggable', true)
            .on('dragstart', this._onDragStart, this)
            .html(this._getSvg())

        const icon = $$('div')
            .addClass('im-cr-icon')
            .append(
                $$(FontAwesomeIcon, {
                    icon: this._getIcon(type)
                })
            )

        const name = $$('div')
            .addClass('im-cr-name')
            .append(
                item.name ? item.name[0] : 'Unidentified',
                this._getProducts($$, item)
            )

        if ('image' === type) {
            name.addClass('im-cr-objectname')
        }

        const media = this._getMedia($$, item, type)

        return $$('div')
            .addClass('im-cr-item')
            .append([
                drag,
                $$('div').addClass('im-cr-content').append([
                    media,
                    name,
                    icon
                ])
            ])
    }

    _getMedia($$, item, type) {
        if ('image' !== type) {
            return null
        }

        let image
        if (this.state.imageLoaded) {
            image = $$('img').attr('src', this.state.imageURL).addClass('image-icon')
        } else {
            this._fetchImageURLForUUID(item.uuid)
                .then(url => {
                    this.setState({
                        imageLoaded: true,
                        imageURL: url
                    })
                })
        }

        return $$('div')
            .addClass('im-cr-media')
            .append(image)
    }

    _getIcon(type) {
        return type === 'image' ? 'fa-picture-o' : 'fa-file-text-o'
    }

    /**
     * Fetch and url for an image via the backend
     * @param uuid
     * @returns {Promise.<T>|*|Promise}
     */
    _fetchImageURLForUUID(uuid) {
        return api.router.get('/api/binary/url/' + uuid + '/40?imType=x-im/image&height=40')
            .then(response => response.text())
            .catch((error) => {
                console.error(error)
            })
    }

    _getSvg() {
        return '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24" xml:space="preserve"> <g> <rect x="7.9" y="1" class="st0" width="2.8" height="22"/> <rect x="13.4" y="1" class="st0" width="2.8" height="22"/> </g> </svg>'
    }
}

export default SearchResultItem

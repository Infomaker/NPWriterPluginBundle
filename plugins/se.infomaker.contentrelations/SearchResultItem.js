import {Component, FontAwesomeIcon} from 'substance'
import {api} from 'writer'

class SearchResultItem extends Component {

    getInitialState() {
        return {
            imageLoaded: false,
            imageURL: ''
        }
    }

    getDroplinkForItem(item) {

        const imType = item.imType[0]
        const name = item.name[0]

        let data = {
            uuid: item.uuid,
            imType: imType,
            name: name
        }
        let dropData = window.btoa(JSON.stringify(data))

        switch (imType) {
            case 'article':
                return "x-im-entity://x-im/article?data=" + dropData
            case 'image':
                return "x-im-entity://x-im/image?data=" + dropData
            default:
                return "x-im-entity://x-im/article?data=" + dropData
        }
    }

    getTitle($$, item) {

        let name = item.name ? item.name[0] : "Unidentified",
            products = item.type,
            productsType = item.typeCatalog ? item.typeCatalog[0] : 'text'

        if (!products) {
            return name;
        }

        if (productsType && productsType === 'icon') {
            const icons = products.map(function (product) {
                return $$('img').attr('src', product).addClass('product-icon');
            });

            const result = $$('span').append(name);

            icons.forEach(function (icon) {
                result.append(icon)
            });

            return result;
        } else {
            return `${name} [${products.join(', ')}]`;
        }
    }

    didMount() {
        this.dropLink = this.getDroplinkForItem(this.props.item)
    }

    _onDragStart(e) {
        e.stopPropagation()
        e.dataTransfer.setData('text/uri-list', this.dropLink)
    }

    render($$) {
        const item = this.props.item

        return this.getItem($$, item)
    }

    getItem($$, item) {
        const imType = item.imType ? item.imType[0] : 'article'

        switch (imType) {
            case 'article':
                return this.getArticleItem($$, item)
            case 'image':
                return this.getImageItem($$, item)
            default:

        }

    }


    /**
     * Get a list item for an article
     * @param $$
     * @param item
     */
    getArticleItem($$, item) {

        const listItem = $$('li')
            .addClass('article')
            .attr('draggable', true)
            .on('dragstart', this._onDragStart, this)

        const icon = $$(FontAwesomeIcon, {icon: 'fa-file-text-o'}).addClass('type-icon')
        const label = $$('span').addClass('title').append(this.getTitle($$, item))

        listItem.append([icon, label])
        return listItem
    }


    /**
     * Get a list item for an image
     * @param $$
     * @param item
     */
    getImageItem($$, item) {
        const listItem = $$('li')
            .addClass('image')
            .attr('draggable', true)
            .on('dragstart', this._onDragStart, this)

        let icon = $$(FontAwesomeIcon, {icon: 'fa-picture-o'})
        const label = $$('span').addClass('title').append(this.getTitle($$, item))

        if (this.state.imageLoaded) {
            icon = $$('img').attr('src', this.state.imageURL).addClass('image-icon')
        } else {
            this.fetchImageURLForUUID(item.uuid)
                .then(url => {
                    this.setState({
                        imageLoaded: true,
                        imageURL: url
                    })
                })
        }

        listItem.append([icon, label])
        return listItem
    }


    /**
     * Fetch and url for an image via the backend
     * @param uuid
     * @returns {Promise.<T>|*|Promise}
     */
    fetchImageURLForUUID(uuid) {
        return api.router.get('/api/binary/url/' + uuid + '/50?imType=x-im/image&width=50')

            .then(response => response.text())

            .catch((error) => {
                console.error(error);
            });
    }

}
export default SearchResultItem
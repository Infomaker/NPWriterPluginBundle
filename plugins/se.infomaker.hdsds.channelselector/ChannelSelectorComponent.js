import {Component} from 'substance'

import {lodash} from 'writer'

const sortBy = lodash.sortBy
const clone = lodash.clone

class ChannelselectorComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    getInitialState() {
        this.configProducts = this.context.api.getConfigValue('channelselector', 'products')

        var channels = this.context.api.newsItem.getChannels(),
            initialChannels = []

        channels.forEach(function (channel) {
            var compare = lodash.find(this.configProducts, function (o) {
                if (o.qcode === channel['qcode']) {
                    o.active = true
                    return true
                }
            })
            initialChannels.push(compare)
        }.bind(this))

        return {
            products: sortBy(this.configProducts, ['active', 'name']),
            selectedProducts: initialChannels
        }
    }

    sortProducts() {
        return sortBy(this.state.products, ['active', 'name'])
    }


    selectProduct(product) {
        var selectedProduct = this.state.selectedProducts,
            products = this.state.products

        var productIndex = products.indexOf(product)

        if (lodash.includes(selectedProduct, product)) {
            delete products[productIndex].active
            selectedProduct.splice(selectedProduct.indexOf(product), 1)
            this.context.api.newsItem.removeChannel('channelselector', product)
        } else {
            selectedProduct.push(product)
            products[productIndex].active = true

            var productToSave = clone(product)
            delete productToSave.active
            this.context.api.newsItem.addChannel('channelselector', productToSave)
        }
        this.extendState({selectedProducts: selectedProduct})
    }

    /**
     * Returns a VirtualDomElement
     *
     * @returns {VirtualDomElement}
     */
    render($$) {

        var el = $$('div').addClass('sc-channelselector'),
            listContainer = $$('div').addClass('sc-productlist-container').addClass('list-group'),
            list = $$('div').addClass('sc-productlist'),
            title = $$('h2').append(this.context.i18n.t('Products'))

        var products = this.sortProducts().map(function (product) {
            var cssClass = product.active ? 'active' : ''
            return $$('a').addClass('list-group-item').addClass(cssClass).append(product.name.toString()).on('click', () => {
                this.selectProduct(product)
            })
        }, this)

        el.append(title)
        list.append(products)
        listContainer.append(list)
        el.append(listContainer)

        return el
    }
}

export default ChannelselectorComponent
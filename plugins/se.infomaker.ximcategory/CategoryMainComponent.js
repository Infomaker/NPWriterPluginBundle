import {Component} from 'substance'
import CategoryList from './CategoryListComponent'
import {api} from 'writer'

class CategoryMainComponent extends Component {
    constructor(...args) {
        super(...args)
        this.name = 'conceptcategory'
    }

    getInitialState() {
        return {
            existingItems: api.newsItem.getCategories(this.name)
        }
    }


    reload() {
        this.extendState({
            existingItems: api.newsItem.getCategories(this.name)
        })
    }

    render($$) {
        const el = $$('div').ref('tagContainer')
            .append(
                $$('h2').append(
                    this.getLabel('Categories')
                )
            )

        const SearchComponent = this.context.componentRegistry.get('form-search')
        const searchComponent = $$(SearchComponent, {
            existingItems: this.state.existingItems,
            searchUrl: '/api/search/concepts/categories?q=',
            onSelect: this.addItem.bind(this),
            placeholderText: "Search categories",
            createAllowed: false
        }).ref('searchComponent')

        const list = $$(CategoryList, {
            items: this.state.existingItems,
            removeItem: this.removeItem.bind(this),
            reload: this.reload.bind(this)
        }).ref('tagList')

        el.append(list)
        el.append(searchComponent)

        return el
    }

    /**
     * @param tag
     */
    removeItem(tag) {
        try {
            api.newsItem.removeLinkByUUID(this.name, tag.uuid)
            this.reload()
        }
        catch (e) {
            // FIXME: Implement exception handling
        }
    }

    addItem(item) {
        try {
            api.newsItem.addCategory(this.name, { uuid: item.uuid, title: item.name[0] })
            this.reload()
        }
        catch (e) {
            // FIXME: Implement exception handling
        }
    }


    closeFromDialog() {
        this.reload()
    }
}

export default CategoryMainComponent

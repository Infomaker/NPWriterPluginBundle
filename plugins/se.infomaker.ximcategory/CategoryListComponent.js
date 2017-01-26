import {Component} from 'substance'
import CategoryItem from './CategoryItemComponent';

class CategoryListComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'conceptcategory'
    }

    render($$) {
        var items = this.props.items
        var tagList = $$('ul').addClass('tag-list')

        var tagEls = items.map(function (item) {
            return $$(CategoryItem, {
                item: item,
                removeItem: this.removeItem.bind(this),
                reload: this.props.reload.bind(this)
            }).ref('tag-' + item.uuid);
        }, this)

        tagList.append(tagEls)

        return tagList
    }

    removeItem(tag) {
        delete this.refs['tag-' + tag.uuid]
        this.props.removeItem(tag)
    }
}

export default CategoryListComponent

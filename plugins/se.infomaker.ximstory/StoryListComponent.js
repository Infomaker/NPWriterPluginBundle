import {Component} from 'substance'
import StoryItem from './StoryItemComponent'

class StoryListComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'ximstory'
    }

    render($$) {
        const items = this.props.items,
            tagList = $$('ul').addClass('tag-list'),
            tagEls = items.map((item) => {
                return $$(StoryItem, {
                    item: item,
                    removeItem: this.removeItem.bind(this),
                    reload: this.props.reload.bind(this)
                }).ref('tag-' + item.uuid)
            }, this)

        tagList.append(tagEls)

        return tagList
    }

    removeItem(tag) {
        delete this.refs['tag-' + tag.uuid]
        this.props.removeItem(tag)
    }
}

export default StoryListComponent


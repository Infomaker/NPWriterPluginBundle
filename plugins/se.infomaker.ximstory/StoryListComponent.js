import {Component} from 'substance/ui/Component'
import StoryItem from './StoryItemComponent'

class StoryListComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'ximstory'
    }
    
    render($$) {
        const items = this.props.items
        const tagList = $$('ul').addClass('tag-list')
        const tagEls = items.map(function (item) {
            return $$(StoryItem, {
                item: item,
                removeItem: this.removeItem.bind(this),
                reload: this.props.reload.bind(this)
            }).ref('tag-'+item.uuid)
        }, this)
        
        tagList.append(tagEls)

        return tagList
    }

    removeItem(tag) {
        delete this.refs['tag-'+tag.uuid]
        this.props.removeItem(tag)
    }
}

export default StoryListComponent


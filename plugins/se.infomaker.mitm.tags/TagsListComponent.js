import {Component} from 'substance'
import TagItem from './TagItemComponent'

class TagsListComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'mmtags';
    }

    render($$) {
        const tags = this.props.tags,

            tagList = $$('ul').addClass('tag-list'),
            tagEls = tags.map((tag) => {
                return $$(TagItem, {
                    tag: tag,
                    removeTag: this.removeTag.bind(this),
                    reload: this.props.reload.bind(this)
                }).ref('tag-' + tag.uuid)
            }, this)

        tagList.append(tagEls)

        return tagList
    }

    removeTag(tag) {
        delete this.refs['tag-' + tag.uuid]
        this.props.removeTag(tag)
    }
}

export default TagsListComponent

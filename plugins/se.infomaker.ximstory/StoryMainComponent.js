import {Component} from 'substance'
import StoryList from './StoryListComponent'
import StoryEditCompoment from './StoryEditComponent'
import StoryTemplate from './template/concept'
import {jxon} from 'writer'

class StoryMainComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'ximstory';
    }

    getInitialState() {
        return {
            existingItems: this.context.api.newsItem.getStories(this.name)
        }
    }


    reload() {
        this.extendState({
            existingItems: this.context.api.newsItem.getStories(this.name)
        })
    }

    render($$) {

        const el = $$('div').ref('tagContainer').addClass('stories').append($$('h2').append(this.getLabel('ximstory-story')))

        const SearchComponent = this.context.componentRegistry.get('form-search')

        const searchComponent = $$(SearchComponent, {
            existingItems: this.state.existingItems,
            searchUrl: '/api/search/concepts/stories?q=',
            onSelect: this.addStory.bind(this),
            onCreate: this.createStory.bind(this),
            placeholderText: this.getLabel('ximstory-search_stories'),
            createAllowed: true
        }).ref('searchComponent')

        const list = $$(StoryList, {
            items: this.state.existingItems,
            removeItem: this.removeItem.bind(this),
            reload: this.reload.bind(this)
        }).ref('tagList')

        el.append(list)
        el.append(searchComponent)

        return el
    }

    removeItem(tag) {
        try {
            this.context.api.newsItem.removeLinkByUUIDAndRel(this.name, tag.uuid, 'subject')
            this.reload()
        } catch (e) {
            console.log(e)
        }
    }

    addStory(story) {
        try {
            this.context.api.newsItem.addStory(this.name, { uuid: story.uuid, title: story.name[0] })
            this.reload()
        } catch (e) {
            console.log(e)
        }
    }

    createStory(searchItem, exists) {
        const parser = new DOMParser();
        const storyXML = parser.parseFromString(StoryTemplate.story, 'text/xml').firstChild

        const item = jxon.build(storyXML);
        item.concept.name = searchItem.inputValue;

        this.context.api.ui.showDialog(StoryEditCompoment, {
            item: item,
            exists: exists,
            newLocation: true,
            close: this.closeFromDialog.bind(this),
            reload: this.reload.bind(this)
        }, {
            primary: this.getLabel('ximstory-Save'),
            title:  this.getLabel('ximstory-create') + " " + searchItem.inputValue,
            global: true
        })
    }

    closeFromDialog() {
        this.reload()
    }
}

export default StoryMainComponent


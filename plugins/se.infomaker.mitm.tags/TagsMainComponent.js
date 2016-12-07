import {Component, FontAwesomeIcon} from 'substance'
import {jxon} from 'writer'
import TagsList from './TagsListComponent'
import TagEditBaseComponent from './TagEditBaseComponent'
import TagEditPersonComponent from './TagEditPersonComponent'
import TagEditCompanyComponent from './TagEditCompanyComponent'
import TagEditTopicComponent from './TagEditTopicComponent'
import TagsTemplate from './template/concept'

class TagsMainComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'mmtags'
    }



    static getTagTypes() {
        return [
            'x-im/organisation',
            'x-im/person',
            'x-im/topic'
        ]
    }

    getInitialState() {
        return {
            existingTags: this.context.api.newsItem.getLinksByType(this.name, TagsMainComponent.getTagTypes(), "subject")
        }
    }


    reload() {
        this.extendState({
            existingTags: this.context.api.newsItem.getLinksByType(this.name, TagsMainComponent.getTagTypes(), "subject")
        })
    }

    render($$) {

        const el = $$('div').ref('tagContainer').addClass('authors').append($$('h2').append('mmtags-title'))

        const searchUrl = this.context.api.router.getEndpoint()

        const SearchComponent = this.context.componentRegistry.get('form-search')

        const searchComponent = $$(SearchComponent, {
            existingItems: this.state.existingTags,
            searchUrl: searchUrl+'/api/search/concepts/tags?q=',
            onSelect: this.addTag.bind(this),
            onCreate: this.createTag.bind(this),
            placeholderText: this.getLabel('mmtags-search_placeholder'),
            createAllowed: true
        }).ref('searchComponent')

        const tagList = $$(TagsList, {
            tags: this.state.existingTags,
            removeTag: this.removeTag.bind(this),
            reload: this.reload.bind(this)
        }).ref('tagList')

        el.append(tagList)
        el.append(searchComponent)

        return el

    }

    /**
     * @param tag
     */
    removeTag(tag) {
        try {
            this.context.api.newsItem.removeLinkByUUIDAndRel(this.name, tag.uuid, 'subject')
            this.reload()
        } catch (e) {
            console.log(e)
        }
    }

    addTag(tag) {
        try {
            this.context.api.newsItem.addTag(this.name, tag)
            this.reload()
        } catch (e) {
            console.log(e)
        }
    }

    createTag(tag, exists) {
        try {
            this.context.api.showDialog(TagEditBaseComponent, {
                tag: tag,
                exists: exists,
                close: this.closeFromDialog.bind(this),
                createPerson: this.createPerson.bind(this),
                createOrganisation: this.createOrganisation.bind(this),
                createTopic: this.createTopic.bind(this)
            }, {
                primary: false,
                title: this.context.i18n.t('mmtags-create') + " " + tag.inputValue,
                global: true
            })

        } catch (e) {
            console.log("E", e)
        }
    }


    createPerson(inputValue) {
        const newName = inputValue.split(' ')

        const parser = new DOMParser();
        const tagXML = parser.parseFromString(TagsTemplate.personTemplate, 'text/xml').firstChild

        // Prepopulate the TAG with user input from form
        tagXML.querySelector('itemMeta itemMetaExtProperty[type="imext:firstName"]').setAttribute('value', newName[0])
        tagXML.querySelector('itemMeta itemMetaExtProperty[type="imext:lastName"]').setAttribute('value', newName[1] ? newName[1] : '')

        const loadedTag = jxon.build(tagXML)

        this.context.api.ui.showDialog(TagEditPersonComponent, {
            tag: loadedTag,
            close: this.closeFromDialog.bind(this)
        }, {
            primary: this.getLabel('mmtags-save'),
            title: this.getLabel('mmtags-create') + " " + inputValue,
            icon: 'fa-user',
            global: true
        })


    }

    createOrganisation(inputValue) {

        const parser = new DOMParser();
        const tagXML = parser.parseFromString(TagsTemplate.organisationTemplate, 'text/xml').firstChild

        // Prepopulate the TAG with user input from form
        tagXML.querySelector('concept name').textContent = inputValue
        const loadedTag = jxon.build(tagXML)

        this.context.api.ui.showDialog(TagEditCompanyComponent, {
            tag: loadedTag,
            close: this.closeFromDialog.bind(this)
        }, {
            primary: this.getLabel('mmtags-save'),
            title: this.getLabel('mmtags-create') + " " + inputValue,
            icon: 'fa-sitemap',
            global: true
        })

    }

    createTopic(inputValue) {
        const parser = new DOMParser();
        const tagXML = parser.parseFromString(TagsTemplate.topicTemplate, 'text/xml').firstChild

        // Prepopulate the TAG with user input from form
        tagXML.querySelector('concept name').textContent = inputValue
        const loadedTag = jxon.build(tagXML)

        this.context.api.ui.showDialog(TagEditTopicComponent, {
            tag: loadedTag,
            close: this.closeFromDialog.bind(this)
        }, {
            primary: this.getLabel('mmtags-save'),
            title: this.getLabel('mmtags-create') + " " + inputValue,
            icon:'fa-tags',
            global: true
        })

    }


    closeFromDialog() {
        this.reload()
    }
}

export default TagsMainComponent
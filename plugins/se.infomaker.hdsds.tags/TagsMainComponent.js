import {Component} from 'substance'
import {jxon, api, event} from 'writer'
import TagsList from './TagsListComponent'
import TagEditBaseComponent from './TagEditBaseComponent'
import TagEditPersonComponent from './TagEditPersonComponent'
import TagEditCompanyComponent from './TagEditCompanyComponent'
import TagsTemplate from './template/concept'

class TagsMainComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'hdsdstags'
    }

    getInitialState() {
        return {
            existingTags: this.context.api.newsItem.getTags(this.getTags())
        }
    }

    reload() {
        this.extendState({
            existingTags: this.context.api.newsItem.getTags(this.getTags())
        })
    }

    didMount() {
        api.events.on(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED_EXTERNAL, e => {
            if (e.data.key === 'itemMetaLink' && this.getTags().indexOf(e.data.value.type) > -1) {
                this.reload()
            }
        })
    }

    dispose() {
        api.events.off(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED_EXTERNAL)
    }

    render($$) {

        const el = $$('div').ref('tagContainer').addClass('authors').append($$('h2').append(this.getLabel('hdsds-tagstitle')))

        const SearchComponent = this.context.componentRegistry.get('form-search')

        const searchComponent = $$(SearchComponent, {
            existingItems: this.state.existingTags,
            searchUrl: '/api/search/concepts/tags?q=',
            onSelect: this.addTag.bind(this),
            onCreate: this.createTag.bind(this),
            placeholderText: this.getLabel('hdsds-tagssearch_placeholder'),
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
        }
        catch (e) {
            // FIXME: Implement exception handling
        }
    }

    addTag(tag) {
        try {
            if (this.isValidTag(tag)) {
                this.context.api.newsItem.addTag(this.name, tag)
                this.reload()
            } else {
                console.error('Tag is invalid or not in plugin configuration', tag)
            }
        }
        catch (e) {
            // FIXME: Implement exception handling
        }
    }

    /**
     * Only handles create new 'person' or 'organisation'.
     *
     * @param tag
     * @param exists
     */
    createTag(tag, exists) {
        try {
            if (this.canCreateTag()) {
                this.context.api.ui.showDialog(TagEditBaseComponent, {
                    tag: tag,
                    exists: exists,
                    close: this.closeFromDialog.bind(this),
                    createPerson: this.createPerson.bind(this),
                    createOrganisation: this.createOrganisation.bind(this)
                }, {
                    primary: false,
                    title: this.getLabel('hdsds-tagscreate') + " " + tag.inputValue,
                    global: true
                })
            } else {
                console.error('Tag plugin not configured to support creation of new tags')
            }
        }
        catch (e) {
            // FIXME: Implement exception handling
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
            primary: this.getLabel('hdsds-tagssave'),
            title: this.getLabel('hdsds-tagscreate') + " " + inputValue,
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
            primary: this.getLabel('hdsds-tagssave'),
            title: this.getLabel('hdsds-tagscreate') + " " + inputValue,
            icon: 'fa-sitemap',
            global: true
        })

    }

    closeFromDialog() {
        this.reload()
    }

    isValidTag(tag) {
        if (tag.imType && tag.imType[0]) {
            return this.getTags().indexOf(tag.imType[0]) > -1
        }
        return false
    }

    getTags() {
        const filters = api.getConfigValue(
            'se.infomaker.tags',
            'filters'
        )

        if (filters) {
            return filters;
        } else {
            // Default filters
            return [
                'x-im/person',
                'x-im/organisation',
                'x-cmbr/channel',
                'x-im/channel',
                'x-im/category'
            ]
        }
    }

    canCreateTag() {
        const tags = this.getTags()

        return tags.indexOf('x-im/person') > -1 && tags.indexOf('x-im/organisation') > -1
    }
}

export default TagsMainComponent

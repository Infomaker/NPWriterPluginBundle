import {Component} from 'substance'
import {api, NilUUID, jxon, idGenerator} from 'writer'
import AuthorListComponent from './AuthorListComponent'
import AuthorEditComponent from './AuthorEditComponent'
import AuthorTemplate from './template/author'

class AuthorMainComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'ximauthor'
    }

    getInitialState() {
        return {
            existingAuthors: api.newsItem.getAuthors()
        }
    }

    reloadAuthors() {
        this.extendState({
            existingAuthors: api.newsItem.getAuthors()
        })
    }

    render($$) {
        const noSearch = api.getConfigValue(this.props.pluginConfigObject.id, 'noSearch');

        const el = $$('div').ref('authorContainer').addClass('authors')
            .append($$('h2')
                .append(this.getLabel('Authors')));

        let searchComponent
        if (noSearch) {
            const AuthorAddComponent = this.context.componentRegistry.get('form-add');

            searchComponent = $$(AuthorAddComponent, {
                existingItems: this.state.existingAuthors,
                onSelect: this.addAuthor.bind(this),
                onCreate: this.createAuthor.bind(this),
                createAllowed: true,
                placeholderText: this.getLabel('Enter author')
            }).ref('authorSearchComponent')
        } else {
            const AuthorSearchComponent = this.context.componentRegistry.get('form-search')

            searchComponent = $$(AuthorSearchComponent, {
                existingItems: this.state.existingAuthors,
                searchUrl: '/api/search/concepts/authors?q=',
                onSelect: this.addAuthor.bind(this),
                onCreate: this.createAuthor.bind(this),
                createAllowed: true,
                placeholderText: this.getLabel('Search authors')
            }).ref('authorSearchComponent')
        }

        const existingAuthorsList = $$(AuthorListComponent, {
            existingAuthors: this.state.existingAuthors,
            removeAuthor: this.removeAuthor.bind(this)
        }).ref('existingAuthorList');

        el.append(existingAuthorsList);
        el.append(searchComponent);

        return el;
    }

    removeAuthor(author) {
        if (NilUUID.isNilUUID(author.uuid)) {
            api.newsItem.removeAuthorByTitle(this.name, author.title);
        } else {
            api.newsItem.removeAuthorByUUID(this.name, author.uuid);
        }
        this.reloadAuthors();
    }

    addAuthor(author) {
        try {
            api.newsItem.addAuthor(this.name, author);
            this.reloadAuthors();
        } catch (e) {
            console.error("e", e);
        }
    }

    createAuthor(authorTemp) {
        const handleConceptAuthors = api.getConfigValue(
            'se.infomaker.ximauthor',
            'handleConceptAuthors'
        )

        // Support for noSearch is to be backward compatible
        const noSearch = api.getConfigValue(
            'se.infomaker.ximauthor',
            'noSearch'
        )

        if (!handleConceptAuthors || noSearch) {
            api.newsItem.addSimpleAuthor(this.name, authorTemp.inputValue);
            this.reloadAuthors()
        } else {
            const author = this._loadTemplate(authorTemp.inputValue)

            this._updateObjectId(author)

            this.context.api.ui.showDialog(AuthorEditComponent,
                {
                    author: author,
                    close: this.closeFromDialog.bind(this),
                    couldNotLoad: this.state.couldNotLoad
                },
                {
                    primary: this.getLabel('Save'),
                    title: this.getLabel('ximauthors-save') + ' ' + authorTemp.inputValue,
                    global: true
                }
            )
        }
    }

    closeFromDialog() {
        this.reloadAuthors()
    }

    _updateObjectId(author) {
        author.concept.metadata.object['@id'] = idGenerator()
    }

    _loadTemplate(fullName) {
        const parser = new DOMParser();
        const authorXml = parser.parseFromString(AuthorTemplate.author, 'text/xml').firstChild

        const nameArray = fullName.split(' ')
        const firstName = nameArray.shift()
        const lastName = nameArray.join(' ')

        authorXml.querySelector('itemMeta itemMetaExtProperty[type="imext:firstName"]').setAttribute('value', firstName)
        authorXml.querySelector('itemMeta itemMetaExtProperty[type="imext:lastName"]').setAttribute('value', lastName)

        return jxon.build(authorXml)
    }
}

export default AuthorMainComponent
import {Component} from 'substance'
import {api, NilUUID} from 'writer'
import AuthorListComponent from './AuthorListComponent'

class AuthorMainComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'ximauthor'
    }

    didMount() {

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
        var el = $$('div').ref('authorContainer').addClass('authors').append($$('h2').append(this.getLabel('Authors')));

        var authorSearchUrl = api.router.getEndpoint();

        const AuthorSearchComponent = this.context.componentRegistry.get('form-search')

        var searchComponent = $$(AuthorSearchComponent, {
            existingItems: this.state.existingAuthors,
            searchUrl: authorSearchUrl + '/api/search/concepts/authors?q=',
            onSelect: this.addAuthor.bind(this),
            onCreate: this.createAuthor.bind(this),
            createAllowed: true,
            placeholderText: this.getLabel('Search authors')
        }).ref('authorSearchComponent')

        var existingAuthorsList = $$(AuthorListComponent, {
            existingAuthors: this.state.existingAuthors,
            removeAuthor: this.removeAuthor.bind(this)
        }).ref('existingAuthorList');

        el.append(existingAuthorsList);
        el.append(searchComponent);

        return el;
    }

    removeAuthor(author) {
        try {
            if (NilUUID.isNilUUID(author.uuid)) {
                api.newsItem.removeAuthorByTitle(this.name, author.title);
            } else {
                api.newsItem.removeAuthorByUUID(this.name, author.uuid);
            }
            this.reloadAuthors();
        } catch (e) {
            console.error(e);
        }
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
        api.newsItem.addSimpleAuthor(this.name, authorTemp.inputValue);
        this.reloadAuthors()
    }
}

export default AuthorMainComponent
'use strict';

//var AuthorSearchComponent = require('./AuthorSearchComponent');
// var AuthorSearchComponent = require('writer/components/form-search/FormSearchComponent');
// var AuthorListComponent = require('./AuthorListComponent');

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
        };
    }

    reloadAuthors() {
        this.extendState({
            existingAuthors: api.newsItem.getAuthors()
        })
    }

    render($$) {
        var el = $$('div').ref('authorContainer').addClass('authors').append($$('h2').append(this.getLabel('Author')));

        var authorSearchUrl = api.router.getEndpoint();

        // var searchComponent = $$(AuthorSearchComponent, {
        //     existingItems: this.state.existingAuthors,
        //     searchUrl: authorSearchUrl + '/api/search/concepts/authors?q=',
        //     onSelect: this.addAuthor.bind(this),
        //     onCreate: this.createAuthor.bind(this),
        //     createAllowed: true,
        //     placeholderText: "Add author"
        // }).ref('authorSearchComponent');

        // var existingAuthorsList = $$(AuthorListComponent, {
        //     existingAuthors: this.state.existingAuthors,
        //     removeAuthor: this.removeAuthor.bind(this)
        // }).ref('existingAuthorList');

        // el.append(existingAuthorsList);
        // el.append(searchComponent);

        return el;
    }


    removeAuthor(author) {
        try {
            if (NilUUID.isNilUUID(author.uuid)) {
                api.removeAuthorByTitle(this.name, author.title);
            } else {
                api.removeAuthorByUUID(this.name, author.uuid);
            }
            this.reloadAuthors();
        } catch (e) {
            console.log(e);
        }
    }

    addAuthor(author) {
        try {
            api.addAuthor(this.name, author);
            this.reloadAuthors();
        } catch (e) {
            console.log("e", e);
        }
    }

    createAuthor(authorTemp) {
        api.addSimpleAuthor(this.name, authorTemp.inputValue);
        this.reloadAuthors()
    }
}

export default AuthorMainComponent
// var AuthorItem = require('./AuthorItemComponent');

import {Component} from 'substance'
import {NilUUID} from 'writer'

class AuthorListComponent extends Component {

    getIdForRef(author) {
        if (NilUUID.isNilUUID(author.uuid)) {
            return 'author-' + author.title.replace(' ', ''); //TODO fix something to solve this reference
        } else if (author.uuid) {
            return 'author-' + author.uuid;
        } else {
            console.warn('No UUID');
        }
    }

    render($$) {
        var existingAuthors = this.props.existingAuthors;
        var authorList = $$('ul').addClass('authors__list');

        existingAuthors.forEach(function (author) {
            // TODO: Watch this reference for memory leaks
            authorList.append($$(AuthorItem, {
                author: author,
                removeAuthor: this.deleteAuthorAndReference.bind(this)
            }).ref(this.getIdForRef(author)));
        }.bind(this));
        return authorList;
    }

    deleteAuthorAndReferencer(author) {
        delete this.refs[this.getIdForRef(author)]; //Manual remove reference
        this.props.removeAuthor(author);
    }
}

/*'use strict';

 var Component = require('substance/ui/Component');
 var $$ = Component.$$;
 var AuthorItem = require('./AuthorItemComponent');
 var NilUUID = require('writer/utils/NilUUID');

 function AuthorListComponent() {
 AuthorListComponent.super.apply(this, arguments);

 this.name = 'author';
 }

 AuthorListComponent.Prototype = function () {

 this.getIdForRef = function(author) {
 if(NilUUID.isNilUUID(author.uuid)) {
 return 'author-'+author.title.replace(' ', ''); //TODO fix something to solve this reference
 } else if ( author.uuid ) {
 return 'author-'+author.uuid;
 } else {
 console.warn('No UUID');
 }
 };

 this.render = function() {
 var existingAuthors = this.props.existingAuthors;
 var authorList = $$('ul').addClass('authors__list');

 existingAuthors.forEach(function (author) {
 // TODO: Watch this reference for memory leaks
 authorList.append($$(AuthorItem, {author: author, removeAuthor: this.deleteAuthorAndReference.bind(this)}).ref(this.getIdForRef(author)));
 }.bind(this));
 return authorList;
 };

 this.deleteAuthorAndReference = function(author) {
 delete this.refs[this.getIdForRef(author)]; //Manual remove reference
 this.props.removeAuthor(author);
 };

 };
 Component.extend(AuthorListComponent);
 module.exports = AuthorListComponent;
 */
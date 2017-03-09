import {Component} from 'substance'
import {NilUUID} from 'writer'
import AuthorItem from './AuthorItemComponent'

class AuthorListComponent extends Component {

    // TODO: constructor?

    getIdForRef(author) {
        if (NilUUID.isNilUUID(author.uuid)) {
            return 'author-' + author.title.replace(' ', '') //TODO fix something to solve this reference
        } else if (author.uuid) {
            return 'author-' + author.uuid
        } else {
            console.warn('No UUID')
        }
    }

    render($$) {
        var existingAuthors = this.props.existingAuthors
        var authorList = $$('ul').addClass('authors__list')

        existingAuthors.forEach((author) => {
            // TODO: Watch this reference for memory leaks
            authorList.append($$(AuthorItem, {
                author: author,
                removeAuthor: this.deleteAuthor.bind(this)
            }).ref(this.getIdForRef(author)));
        });
        return authorList;
    }

    deleteAuthor(author) {
        this.props.removeAuthor(author);
    }
}

export default AuthorListComponent
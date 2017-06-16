import {Component} from 'substance'
import {NilUUID} from 'writer'
import AuthorItemComponent from './AuthorItemComponent'
import SimpleAuthorItemComponent from './SimpleAuthorItemComponent'

class AuthorListComponent extends Component {

    getIdForRef(author) {
        if (NilUUID.isNilUUID(author.uuid)) {
            return 'author-' + author.title.replace(' ', '')
        } else if (author.uuid) {
            return 'author-' + author.uuid
        } else {
            console.warn('No UUID')
        }
    }

    render($$) {
        const existingAuthors = this.props.existingAuthors
        const authorList = $$('ul').addClass('authors__list')

        existingAuthors.forEach((author) => {
            if (!NilUUID.isNilUUID(author.uuid)) {
                authorList.append($$(AuthorItemComponent, {
                    uuid: author.uuid,
                    removeAuthor: this.deleteAuthor.bind(this)
                }).ref(this.getIdForRef(author)))
            } else {
                authorList.append($$(SimpleAuthorItemComponent, {
                    authorName: author.title,
                    removeAuthor: this.deleteAuthor.bind(this)
                }).ref(this.getIdForRef(author)))
            }
        });
        return authorList;
    }

    deleteAuthor(author) {
        this.props.removeAuthor(author);
    }
}

export default AuthorListComponent
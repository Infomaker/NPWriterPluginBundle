import {api, Validator} from 'writer'


class Authors extends Validator {

    /**
     * Main validation method
     */
    validate() {
        const authors = api.newsItem.getAuthors()
        this.validateAuthorCount(authors)
    }

    /**
     * Ensure that article contains at least one author
     * @param {Object[]} authors
     */
    validateAuthorCount(authors) {
        if (authors.length === 0) {
            this.addWarning(api.getLabel('validator-author-missing'))
        }
    }
}

export default Authors

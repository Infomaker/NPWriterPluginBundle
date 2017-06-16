import {Validator, api} from 'writer'

class AuthorValidation extends Validator {

    constructor(...args) {
        super(...args)
    }

    validate() {
        if(api.newsItem.getAuthors().length === 0) {
            this.addWarning(api.getLabel('validation-no-author'))
        }
    }
}

export default AuthorValidation
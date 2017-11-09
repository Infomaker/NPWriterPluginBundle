import {api, Validator} from 'writer'
import saveOrPublish from '../util/saveOrPublish'


class Categories extends Validator {

    /**
     * Main validation method
     */
    validate() {
        const categories = api.newsItem.getTags(["x-im/category"])
        this.validateCategoryCount(categories)
    }

    /**
     * Ensure that article contains at least one category
     * @param {Object[]} categories
     */
    validateCategoryCount(categories) {
        if (categories.length === 0) {
            if (saveOrPublish() === 'save') {
                this.addWarning(api.getLabel('validator-category-missing'))
            } else {
                this.addError(api.getLabel('validator-category-missing'))
            }
        }
    }
}

export default Categories

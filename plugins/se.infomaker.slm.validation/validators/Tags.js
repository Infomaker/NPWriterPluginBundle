import {api, Validator} from 'writer'
import saveOrPublish from '../util/saveOrPublish'


class Tags extends Validator {

    /**
     * Main validation method
     */
    validate() {
        const tags = api.newsItemArticle.querySelectorAll('itemMeta > links > link[rel="subject"]')
        this.validateTagCount(tags)
    }

    /**
     * Ensure that article contains at least one tag
     * @param {Element[]} tags
     */
    validateTagCount(tags) {
        if (tags.length === 0) {
            if (saveOrPublish() === 'save') {
                this.addWarning(api.getLabel('validator-tags-missing'))
            } else {
                this.addError(api.getLabel('validator-tags-missing'))
            }
        }
    }
}

export default Tags

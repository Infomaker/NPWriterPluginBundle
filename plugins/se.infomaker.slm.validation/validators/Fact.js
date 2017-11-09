import {api, Validator} from 'writer'
import saveOrPublish from '../util/saveOrPublish'


class Fact extends Validator {

    /**
     * Main validation method
     */
    validate() {
        const contentParts = [...this.newsItem.querySelectorAll('idf > group object[type="x-im/content-part"]')]
        const facts = contentParts.filter(contentPart => {
            return contentPart.querySelector('links link[uri="im:/content-part/fact"]') !== null
        })

        this.validateFactCount(facts)
    }

    /**
     * Ensure that article contains only one fact
     * @param {Element[]} facts
     */
    validateFactCount(facts) {
        if (facts.length > 1) {
            if (saveOrPublish() === 'save') {
                this.addWarning(api.getLabel('validator-fact-too-many'))
            } else {
                this.addError(api.getLabel('validator-fact-too-many'))
            }
        }
    }
}

export default Fact

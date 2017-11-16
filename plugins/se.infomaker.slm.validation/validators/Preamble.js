import {api, Validator} from 'writer'
import saveOrPublish from '../util/saveOrPublish'


class Preamble extends Validator {

    /**
     * Main validation method
     */
    validate() {
        const preambles = [...this.newsItem.querySelectorAll('idf > group element[type="preamble"]')]
        this.validatePreambleCount(preambles)
    }

    /**
     * Ensure that article only contains one preamble
     * @param {Element[]} preambles
     */
    validatePreambleCount(preambles) {
        if (preambles.length === 0) {
            if (saveOrPublish() === 'save') {
                this.addWarning(api.getLabel('validator-preamble-missing'))
            } else {
                this.addError(api.getLabel('validator-preamble-missing'))
            }
        }
    }

}

export default Preamble

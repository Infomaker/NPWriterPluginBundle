import {api, Validator} from 'writer'
import saveOrPublish from '../util/saveOrPublish'


class Preamble extends Validator {

    /**
     * Main validation method
     */
    validate() {
        const preambles = [...this.newsItem.querySelectorAll('idf > group element[type="preamble"]')]
        this.validatePreambleCount(preambles)
        this.validatePreamblesNotEmpty(preambles)
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

    /**
     * Ensure that preambles are not empty
     * @param {Element[]} preambles
     */
    validatePreamblesNotEmpty(preambles) {
        for (let i = 0; i < preambles.length; i++) {
            const preamble = preambles[i];
            const content = preamble.childNodes.length === 0 ? '' : preamble.firstChild.textContent.trim()
            if (content === '') {
                if (saveOrPublish() === 'save') {
                    this.addWarning(api.getLabel('validator-preamble-empty'))
                } else {
                    this.addError(api.getLabel('validator-preamble-empty'))
                }
                break
            }
        }
    }
}

export default Preamble

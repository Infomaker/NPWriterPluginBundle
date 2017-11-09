import {api, Validator} from 'writer'


class Headline extends Validator {

    /**
     * Main validation method
     */
    validate() {
        const headlines = [...this.newsItem.querySelectorAll('idf > group element[type="headline"]')]
        this.validateHeadlineCount(headlines)
        headlines.slice(0, 1).forEach(this.validateHeadlineNotEmpty.bind(this))
    }

    /**
     * Ensure that article only contains one headline
     * @param {Element[]} headlines
     */
    validateHeadlineCount(headlines) {
        if (headlines.length === 0) {
            this.addError(api.getLabel('validator-headline-missing'))
        } else if (headlines.length > 1) {
            this.addError(api.getLabel('validator-headline-too-many'))
        }
    }

    /**
     * Ensure that headlines are not empty
     * @param {Element} headline A single headline
     */
    validateHeadlineNotEmpty(headline) {
        const content = headline.childNodes.length === 0 ? '' : headline.firstChild.textContent.trim()
        if (content === '') {
            this.addError(api.getLabel('validator-headline-empty'))
        }
    }
}

export default Headline

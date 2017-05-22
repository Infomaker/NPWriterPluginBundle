import {Validator, api} from 'writer'

class DefaultValidation extends Validator {

    /**
     * Call super constructor
     * @param args
     */
    constructor(...args) {
        super(...args)

        // FIXME: Hard coded value... should maybe be config or label?
        // this.headlinePlaceholder = 'Rubrik här...'
    }

    /**
     * Main validation method
     */
    validate() {
        this.validateHeadline()

        // TODO: Make these configurable and include in default validation
        // this.validatePublicationchannel()
        //
        // this.validateMainchannel()
        //
        // this.validateCategory()
    }

    /**
     * Ensure that a valid headline exists
     */
    validateHeadline() {
        const headlines = this.newsItem.querySelectorAll('idf > group element[type="headline"]')
        const headline = headlines[0].childNodes.length === 0 ? '' : headlines[0].firstChild.textContent.trim()

        if (headlines.length === 0) {
            this.addValidationMessage(
                api.getLabel('The article is missing a headline which might make it hard to find.')
            )
        }
        else if (headline === '') {
            this.addValidationMessage(
                api.getLabel('The first headline in the article should not be empty.')
            )
        }

        // FIXME: Make this configurable and enable...
        // else if (headline === this.headlinePlaceholder) {
        //     this.addValidationMessage(
        //         api.getLabel('Looks like the first headline is not correct.')
        //     )
        // }
    }

    /**
     * Ensure that a publication channel (service) has been chosen.
     * (<service qcode="imchn:hd"/>)
     */
    validatePublicationchannel() {
        this.validateXpath(
            'itemMeta > service',
            'The article must have a least one publication channel.'
        )
    }

    /**
     * Ensure existance of a main channel.
     * (<link rel="channel" title="Kalmar" type="x-im/channel" uuid="7998ec7a-9fd0-4a6f-aee0-168e71f8ba83"/>)
     */
    validateMainchannel() {
        this.validateXpath(
            'itemMeta > links > link[type="x-im/channel"]',
            'Main channel is missing.'
        )
    }

    /**
     * Ensure that at least one category exists.
     * (<link title="Sport/Soccer/Women" uuid="b4a403a0-eeec-e611-5646-9e182111df90" rel="subject" type="x-im/category"/>)
     */
    validateCategory() {
        this.validateXpath(
            'itemMeta > links > link[type="x-im/category"]',
            'At least one category must be chosen.'
        )
    }

    /**
     * Validate that a concept exists, or else add warning or error message.
     *
     * @param {string} xpath
     * @param {string} message
     */
    validateXpath(xpath, message) {
        const links = this.newsItem.querySelectorAll(xpath)

        if (links.length === 0) {
            this.addValidationMessage(
                api.getLabel(message)
            )
        }
    }

    /**
     * Only issue warnings for draft/canceled, error for other statuses
     *
     * @param {string} message
     */
    addValidationMessage(message) {
        const pubStatus = api.newsItem.getPubStatus()
        let addMessage

        // Only issue warnings in draft status, errors for publication
        switch (pubStatus.qcode) {
            case 'imext:draft':
            case 'stat:canceled':
                addMessage = this.addWarning.bind(this)
                break

            default:
                addMessage = this.addError.bind(this)
        }

        addMessage(message)
    }
}

export default DefaultValidation

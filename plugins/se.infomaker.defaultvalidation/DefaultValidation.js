import {Validator, api} from 'writer'

class DefaultValidation extends Validator {

    /**
     * Call super constructor
     * @param args
     */
    constructor(...args) {
        super(...args)
    }


    validate() {
        var pubStatus = api.newsItem.getPubStatus(),
            headlines = this.newsItem.querySelectorAll('idf>group element[type="headline"]'),
            messageMethod;

        // This validation only checks headline, we want to stop publishing without
        // headline, but allow draft and cancelling with just a warning.
        switch (pubStatus.qcode) {
            case 'imext:draft':
            case 'stat:canceled':
                messageMethod = this.addWarning.bind(this);
                break;
            default:
                messageMethod = this.addError.bind(this);
        }

        if (headlines.length === 0) {
            messageMethod('The article is missing a headline which might make it hard to find.')
        }
        else if (headlines[0].childNodes.length === 0 ||
            headlines[0].firstChild.textContent.trim() === '') {

            messageMethod('The first headline in the article should not be empty.')

        }
    }
}

export default DefaultValidation
/*
 module.exports = {
 /**
 * Validation function
 *
 * Validation function must return an array of message objects. If no
 * errors, warnings or info messages are returned just return empty array.
 *
 * The context contains referenses to the writer api and i18n for transactions.
 *
 * A message object must contain two properties: type and message
 * {
 *    type: {string}, info, warning, error
 *    message: {string}, translated message
 * }
 *
 * WARNING!
 *
 * Validation should not alter the newsItem in any way. The newsItem parameter
 * is a copy of the original newsItem and thus changes will have no effect.
 * The api still references the original newsItem which means that no api functions
 * that alter the newsItem should be used.
 *
 * This behaviour is going to change...
 *
 * @param {DOMDocument} newsItem News item DOMDocument to validate.
 *
 * @return {array} Array of message objects
 *//*
 isValid: function(newsItem) {
 var messages = [],
 pubStatus = this.context.api.getPubStatus(),
 headlines = newsItem.querySelectorAll('idf>group element[type="headline"]'),
 messageType;

 // This validation only checks headline, we want to stop publishing without
 // headline, but allow draft and cancelling with just a warning.
 switch(pubStatus.qcode) {
 case 'imext:draft':
 case 'stat:canceled':
 messageType = 'warning';
 break;
 default:
 messageType = 'error';
 }

 messages.push({
 type: 'info',
 message: this.context.i18n.t('This is a info message.')
 });

 messages.push({
 type: 'warning',
 message: this.context.i18n.t('This is a warning message.')
 });


 if (headlines.length === 0) {

 // If there are no headlines at all
 messages.push({
 type: messageType,
 message: this.context.i18n.t('The article is missing a headline which might make it hard to find.')
 });

 }
 else if (headlines[0].childNodes.length === 0 ||
 headlines[0].firstChild.nodeName != '#text' ||
 headlines[0].firstChild.textContent.trim() === '') {

 // If there are headlines but the first headline is empty
 messages.push({
 type: messageType,
 message: this.context.i18n.t('The first headline in the article should not be empty.')
 });

 }

 // Return message array
 return messages;
 }
 };
 */

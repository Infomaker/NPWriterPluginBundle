import {Validator, api} from 'writer'

class YoutubeEmbedValidation extends Validator {

    constructor(...args) {
        super(...args)
    }

    validate() {

        const youtubeItems = this.newsItem.querySelectorAll('object[type="x-im/youtube"]')

        Array.prototype.forEach.call(youtubeItems, (item) => {
            const startEl = item.querySelector('start')
            const time = parseInt(startEl.textContent, 10)
            if (!Number.isInteger(time)) {
                this.addWarning(api.getLabel('Youtube video has a invalid start time'))
            }
        })


    }

}

export default YoutubeEmbedValidation
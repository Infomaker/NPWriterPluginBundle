import {api, Validator} from 'writer'
import saveOrPublish from '../util/saveOrPublish'


class MainChannel extends Validator {

    /**
     * Main validation method
     */
    validate() {
        const mainChannel = api.newsItem.getMainChannel()
        this.validateMainChannelExistance(mainChannel)
    }

    /**
     * Ensure that article contains a main channel
     * @param {Object} mainChannel
     */
    validateMainChannelExistance(mainChannel) {
        if (mainChannel === null) {
            if (saveOrPublish() === 'save') {
                this.addWarning(api.getLabel('validator-main-channel-missing'))
            } else {
                this.addError(api.getLabel('validator-main-channel-missing'))
            }
        }
    }
}

export default MainChannel

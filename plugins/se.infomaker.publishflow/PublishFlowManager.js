const {api, moment} = writer
class PublishFlowConfiguration {
    constructor(pluginId) {
        this.pluginId = pluginId

        this.status = api.getConfigValue('se.infomaker.publishflow', 'workflow')
    }

    getActionDefinition(qcode) {
        if (!this.status[qcode]) {
            return null
        }

        return this.status[qcode]
    }

    getAllowedActions(status) {
        if (this.status[status]) {
            return this.status[status].allowed
        }

        return []
    }


    setToWithheld(from, to) {
        let fromObj = moment(from),
            toObj = moment(to)

        if (!fromObj.isValid()) {
            throw new Error('Invalid from date and time')
        }

        this.setStatus(
            'stat:withheld',
            {value: fromObj.format('YYYY-MM-DDTHH:mm:ssZ')},
            !toObj.isValid() ? null : {value: toObj.format('YYYY-MM-DDTHH:mm:ssZ')}
        )
    }

    setToUsable() {
        this.setStatus(
            'stat:usable',
            {value: moment().format('YYYY-MM-DDTHH:mm:ssZ')},
            null
        )
    }

    // FIXME: Most calls should not remove pubStart
    // FIXME: stat:usable should set pubStart
    // FIXME: stat:canceled should remove pubStart
    setStatus(qcode, pubStart, pubStop) {
        if (qcode) {
            api.newsItem.setPubStatus(
                this.pluginId,
                {
                    qcode: qcode
                }
            )
        }

        if (pubStart === null) {
            api.newsItem.removePubStart(this.pluginId)
        }
        else if (typeof pubStart !== 'undefined') {
            api.newsItem.setPubStart(this.pluginId, pubStart)
        }

        if (pubStop === null) {
            api.newsItem.removePubStop(this.pluginId)
        }
        else if (typeof pubStop !== 'undefined') {
            api.newsItem.setPubStop(this.pluginId, pubStop)
        }

    }
}

export default PublishFlowConfiguration

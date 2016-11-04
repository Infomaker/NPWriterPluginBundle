const {api, moment} = writer
class PublishFlowConfiguration {
    constructor(pluginId) {
        this.pluginId = pluginId

        this.status = {
            'imext:draft': {
                'allowed': [
                    'imext:done',
                    'stat:usable',
                    'stat:withheld'
                ]
            },
            'imext:done': {
                'allowed': [
                    'stat:usable',
                    'imext:draft',
                    'stat:withheld'
                ]
            },
            'stat:withheld': {
                'allowed': [
                    'stat:usable',
                    'stat:canceled',
                    'imext:draft'
                ]
            },
            'stat:usable': {
                'allowed': [
                    'stat:usable',
                    'stat:canceled'
                ]
            },
            'stat:canceled': {
                'allowed': [
                    'imext:draft',
                    'imext:done',
                    'stat:usable',
                    'stat:withheld'
                ]
            },
        }
    }

    getAllowedActions(status) {
        if (this.status[status]) {
            return this.status[status].allowed
        }

        return []
    }

    setToDraft() {
        this.setStatus('imext:draft', null, null)
    }

    setToDone() {
        this.setStatus('imext:done', null, null)
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

    setToCanceled() {
        this.setStatus('stat:canceled', null, null)
    }

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

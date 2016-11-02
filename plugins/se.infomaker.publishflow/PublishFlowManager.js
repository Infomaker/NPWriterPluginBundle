const {api, moment} = writer
class PublishFlowConfiguration {
    constructor(pluginId) {
        this.api = pluginId

        this.status = {
            'imext:draft': {
                'allowed': [
                    'imext:done',
                    'stat:withheld',
                    'stat:usable'
                ]
            },
            'imext:done': {
                'allowed': [
                    'stat:withheld',
                    'stat:usable',
                    'imext:draft'
                ]
            },
            'stat:withheld': {
                'allowed': [
                    'imext:draft',
                    'stat:usable',
                    'stat:canceled'
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
                    'stat:withheld',
                    'stat:usable'
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

    setToWithheld() {

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
            api.newsItem.setPubstatus(
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

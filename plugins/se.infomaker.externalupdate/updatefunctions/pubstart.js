import {event} from 'writer'

class PubStart {

    constructor(documentApi) {
        this.documentApi = documentApi
    }

    getKey() {
        return "pubStart"
    }

    set(data) {
        this.documentApi.setPubStart({
            change: data.value,
            eventType: event.DOCUMENT_CHANGED_EXTERNAL
        })
    }
}

export {PubStart}


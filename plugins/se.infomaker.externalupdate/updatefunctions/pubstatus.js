import {event} from 'writer'

class PubStatus {

    constructor(documentApi) {
        this.documentApi = documentApi
    }

    getKey() {
        return "pubStatus"
    }

    set(data) {
        this.documentApi.setPubStatus({
            change: data.value,
            eventType: event.DOCUMENT_CHANGED_EXTERNAL
        })
    }
}

export {PubStatus}


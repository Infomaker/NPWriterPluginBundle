import {event} from 'writer'

class PubStop {

    constructor(documentApi) {
        this.documentApi = documentApi
    }

    getKey() {
        return "pubStop"
    }

    set(data) {
        this.documentApi.setPubStop({
            change: data.value,
            eventType: event.DOCUMENT_CHANGED_EXTERNAL
        })
    }
}

export {PubStop}


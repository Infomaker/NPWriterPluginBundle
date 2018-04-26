import {event} from 'writer'
class EdNote {

    constructor(documentApi) {
        this.documentApi = documentApi
    }

    getKey() {
        return "edNote"
    }

    set(data) {
        this.documentApi.setEdNote({
            change: data.value,
            eventType: event.DOCUMENT_CHANGED_EXTERNAL
        })
    }

}

export {EdNote}


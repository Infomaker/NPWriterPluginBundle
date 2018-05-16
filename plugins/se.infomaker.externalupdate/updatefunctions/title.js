import {event} from 'writer'
class Title {

    constructor(documentApi) {
        this.documentApi = documentApi
    }

    getKey() {
        return "title"
    }

    set(data) {
        this.documentApi.setTitle({
            change: data.value,
            eventType: event.DOCUMENT_CHANGED_EXTERNAL
        })
    }

}

export {Title}


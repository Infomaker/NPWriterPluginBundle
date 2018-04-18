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
            eventType: "external:update"
        })
    }

}

export {EdNote}


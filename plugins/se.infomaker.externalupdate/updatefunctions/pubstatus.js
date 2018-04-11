class PubStatus {

    constructor(documentApi) {
        this.api = documentApi
    }

    static getKey() {
        return "pubStatus"
    }

    replace(data) {
        this.api.setPubStatus({
            change:data.value,

        })
    }
}

export {PubStatus}


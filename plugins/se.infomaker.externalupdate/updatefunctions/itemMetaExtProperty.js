class ItemMetaExtProperty {

    constructor(documentApi) {
        this.documentApi = documentApi
    }

    getKey() {
        return "itemMetaExtProperty"
    }

    set(data) {
        this.documentApi.setItemMetaExtProperty({
            change: data.value,
            eventType: "external:update"
        })
    }

}

export {ItemMetaExtProperty}


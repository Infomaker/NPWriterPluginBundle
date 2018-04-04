import {PubStatus} from "./updatefunctions/pubstatus";


class UpdateMessageHandler {
    constructor(api) {
        this.updateFunctions = new Map()
        this.api = api

        register(PubStatus)

    }

    handleMessage(documentUpdateMessage) {
        this.validateMessage(documentUpdateMessage)
    }

    validateMessage(documentUpdateMessage) {
        if (!documentUpdateMessage.changes) {
            throw new Error("Missing 'changes' section in message")
        }
    }

    register(updateFunction) {
        const updateFunctionInstance = new updateFunction()
        this.updateFunctions.set(updateFunctionInstance.getKey(), updateFunctionInstance);
    }

}

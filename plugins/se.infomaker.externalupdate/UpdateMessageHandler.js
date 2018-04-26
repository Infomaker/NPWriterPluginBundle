import {PubStatus} from "./updatefunctions/pubstatus";
import {EdNote} from "./updatefunctions/edNote";
import {ItemMetaExtProperty} from "./updatefunctions/itemMetaExtProperty";
import {PubStart} from "./updatefunctions/pubstart";


class UpdateMessageHandler {
    constructor(api) {
        this.updateFunctions = new Map()
        this.api = api

        this.register(PubStatus)
        this.register(PubStart)
        this.register(EdNote)
        this.register(ItemMetaExtProperty)

    }

    handleMessage(documentUpdateMessage) {
        this.validateMessage(documentUpdateMessage)

        documentUpdateMessage.changes.forEach((updateSpec) => {
            this.executeUpdateSpec(updateSpec)
        })
    }

    executeUpdateSpec(spec) {
        console.log("About to execute update function for " + spec)
        const updateFunction = this.updateFunctions.get(spec.key)
        updateFunction[spec.op]({value: spec.value})
    }

    validateMessage(documentUpdateMessage) {
        if (!documentUpdateMessage.changes) {
            throw new Error("Missing 'changes' section in message")
        }

        if (!Array.isArray(documentUpdateMessage.changes)) {
            throw new Error("Changes should be of type array")
        }

        documentUpdateMessage.changes.forEach((item) => {
            const key = item.key
            const updateFunction = this.updateFunctions.get(key)

            if (typeof updateFunction !== 'object') {
                throw new Error("No valid update function found for key: " + key)
            }

            const operation = updateFunction[item.op]
            if (typeof operation !== 'function') {
                throw new Error(`Update function '${key}' does not contain operation '${item.op}`)
            }
        })
    }

    register(updateFunction) {
        const updateFunctionInstance = new updateFunction(this.api.article)
        this.updateFunctions.set(updateFunctionInstance.getKey(), updateFunctionInstance);
    }

}


export {UpdateMessageHandler}

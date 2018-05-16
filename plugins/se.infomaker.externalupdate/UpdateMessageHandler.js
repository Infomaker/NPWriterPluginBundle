import {ItemMetaExtProperty} from "./updatefunctions/itemMetaExtProperty";
import {event} from 'writer'


class UpdateMessageHandler {
    constructor(api) {
        const article = api.article
        this.updateFunctions = new Map()

        this.updateFunctions.set('pubStart', {
            set: article.setPubStart
        })

        this.updateFunctions.set('pubStop', {
            set: article.setPubStop
        })

        this.updateFunctions.set('pubStatus', {
            set: article.setPubStatus
        })

        this.updateFunctions.set('edNote', {
            set: article.setEdNote
        })

        this.updateFunctions.set('title', {
            set: article.setTitle
        })

        this.updateFunctions.set('title', {
            set: article.setTitle
        })

        this.updateFunctions.set('itemMetaExtProperty', {
            set: article.setItemMetaExtProperty
        })

        this.updateFunctions.set('itemMetaLink', {
            add: article.addItemMetaLink,
            remove: article.removeItemMetaLink
        })

        this.updateFunctions.set('altId', {
            set: article.setAltId
        })

        this.updateFunctions.set('slugline', {
            set: article.setSlugline
        })

        this.updateFunctions.set('description', {
            set: article.setDescription
        })

        this.updateFunctions.set('language', {
            set: article.setLanguage
        })

        this.updateFunctions.set('by', {
            set: article.setBy
        })

        this.updateFunctions.set('headline', {
            set: article.setHeadline
        })

        this.updateFunctions.set('contentMetaLink', {
            add: article.addContentMetaLink,
            remove: article.removeContentMetaLink
        })

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
        updateFunction[spec.op]({change: spec.value, eventType: event.DOCUMENT_CHANGED_EXTERNAL})
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

}


export {UpdateMessageHandler}

import {api, event} from 'writer'
import {assertThat} from "./Functions";

class UpdateMessageHandler {
    constructor(api, getLabel) {
        const article = api.article
        this.updateFunctions = new Map()

        this.updateFunctions.set('pubStart', {set: article.setPubStart})

        this.updateFunctions.set('pubStop', {set: article.setPubStop})

        this.updateFunctions.set('pubStatus', {set: article.setPubStatus})

        this.updateFunctions.set('edNote', {set: article.setEdNote})

        this.updateFunctions.set('title', {set: article.setTitle})

        this.updateFunctions.set('title', {set: article.setTitle})

        this.updateFunctions.set('itemMetaExtProperty', {set: article.setItemMetaExtProperty})

        this.updateFunctions.set('itemMetaLink', {
            add: article.addItemMetaLink,
            remove: article.removeItemMetaLink
        })

        this.updateFunctions.set('altId', {set: article.setAltId})

        this.updateFunctions.set('slugline', {set: article.setSlugline})

        this.updateFunctions.set('description', {set: article.setDescription})

        this.updateFunctions.set('language', {set: article.setLanguage})

        this.updateFunctions.set('by', {set: article.setBy})

        this.updateFunctions.set('headline', {set: article.setHeadline})

        this.updateFunctions.set('contentMetaLink', {
            add: article.addContentMetaLink,
            remove: article.removeContentMetaLink
        })

        this.updateFunctions.set('contentMetaData', {
            add: article.addContentMetaData,
            remove: article.removeContentMetaData
        })

        this.article = article
        this.api = api
        this.getLabel = getLabel
    }

    handleMessage(message) {
        try {
            this.validateMessage(message)
            this.validateState(message)
            message.changes.forEach((updateSpec) => {
                this.executeUpdateSpec(updateSpec)
            })

            this.notifyMessageApplied(message)
        } catch (e) {
            this.notifyMessageFailed(message)
        }
    }

    notifyMessageFailed(message) {
        api.ui.showNotification('se.infomaker.externalupdate', "Failed", "Failed")
    }

    notifyMessageApplied(message) {
        if (message.changedBy) {
            const title = message.changedBy.name || this.getLabel('externalChangeTitle')
            const email = message.changedBy.email || this.getLabel('externalChangeSomeone')
            const body = message.changedBy.message || this.getLabel('externalChangeMessage')
            this.api.ui.showNotification(
                'se.infomaker.externalupdate',
                title,
                `${body} --${email}`)
        } else {
            api.ui.showNotification(
                'se.infomaker.externalupdate',
                this.getLabel('externalChangeTitle'),
                this.getLabel('externalChangeMessage'))
        }

    }

    executeUpdateSpec(spec) {
        const updateFunction = this.updateFunctions.get(spec.key)
        updateFunction[spec.op].call(this.article, {change: spec.value, eventType: event.DOCUMENT_CHANGED_EXTERNAL})
    }

    validateState(spec) {
        const guid = api.newsItem.getGuid()

        const currentEtag = api.router.getEtag(guid)

        assertThat(guid).equalTo(spec.uuid, "Document uuid does not match the one in update message")
        assertThat(currentEtag).equalTo(spec.checksums.replaces, "Checksum differs from the one in update message")
    }

    validateMessage(spec) {
        assertThat(spec.uuid).isDefined("Missing 'uuid' in message")
        assertThat(spec.checksums).isDefined("Missing 'checksumes' section in message")
        assertThat(spec.checksums.replaces).isDefined("Missing 'replaces' checksum")
        assertThat(spec.checksums.new).isDefined("Missing 'new' checksum")
        assertThat(spec.changes).isDefined("Missing 'changes' section in message")

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

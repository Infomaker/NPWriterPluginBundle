import {api, event} from 'writer'
import {assertThat} from "./Functions";
import Ajv from 'ajv'
import schema from './external-update-jsonschema'
import schema_draft__06 from 'ajv/lib/refs/json-schema-draft-06'


class UpdateMessageHandler {
    constructor(article, {failed, applied}) {

        this.ajv = new Ajv()
        this.ajv.addMetaSchema(schema_draft__06)

        this.updateFunctions = new Map()

        this.updateFunctions.set('pubStart', {set: article.setPubStart})

        this.updateFunctions.set('service', {
            add: article.addService,
            remove: article.removeService
        })

        this.updateFunctions.set('pubStop', {set: article.setPubStop})

        this.updateFunctions.set('pubStatus', {set: article.setPubStatus})

        this.updateFunctions.set('edNote', {set: article.setEdNote})

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

        this.updateFunctions.set('idfLanguage', {set: article.setIdfLanguage})

        this.updateFunctions.set('by', {set: article.setBy})

        this.updateFunctions.set('headline', {set: article.setHeadline})

        this.updateFunctions.set('contentMetaLink', {
            add: article.addContentMetaLink,
            remove: article.removeContentMetaLink
        })

        this.updateFunctions.set('contentMetadata', {
            add: article.addContentMetadata,
            remove: article.removeContentMetadata
        })

        this.article = article
        this.failed = failed
        this.applied = applied
    }

    handleMessage(message) {
        try {
            this.validateMessage(message)
            this.validateState(message)
            message.changes.forEach((updateSpec) => {
                this.executeUpdateSpec(updateSpec)
            })

            this.updateArticleEtag(message)

            this.applied(message)
        } catch (e) {
            this.failed(message, e)
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

        const valid = this.ajv.validate(schema, spec)

        if (!valid) {
            throw new Error("The message does not match the json schema")
        }

        assertThat(spec.uuid).isDefined("Missing 'uuid' in message")
        assertThat(spec.checksums).isDefined("Missing 'checksums' section in message")
        assertThat(spec.checksums.replaces).isDefined("Missing 'replaces' checksum")
        assertThat(spec.checksums.new).isDefined("Missing 'new' checksum")
        assertThat(spec.changes).isDefined("Missing 'changes' section in message")

        if (!Array.isArray(spec.changes)) {
            throw new Error("Changes should be of type array")
        }

        spec.changes.forEach((item) => {
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

    updateArticleEtag(spec) {
        const newEtag = spec.checksums.new
        api.router.setEtag(spec.uuid, newEtag)
    }

}


export {UpdateMessageHandler}

import {DefaultDOMElement, uuid} from 'substance'
import {api} from 'writer'
import ContentPartManager from './ContentPartManager'

/**
 * Converts between NewsML and editor nodes.
 */
export default {
    type: 'contentpart',
    tagName: 'object',

    matchElement: (el) => {
        // If we need to enable support for another type, specify in config
        //const type = api.getConfigValue('se.infomaker.contentpart', 'type', 'x-im/content-part')

        const type = 'x-im/content-part'
        return el.is('object') && el.attr('type') === type
    },

    /**
     * Import a contentpart element from NewsML.
     */
    import: function(el, node, converter) {
        const $$ = DefaultDOMElement.createElement

        // Instantiate the manager to create all fields in node.fields
        const manager = new ContentPartManager(node)

        node.id = el.attr('id')

        if (el.find('uuid')) {
            node.uuid = el.attr('uuid')
        }

        if (el.find('subject')) {
            node.subject = el.find('subject').text()
        }

        // Get inline-text link if any (optional)
        const link = el.find('links > link[rel="content-part"]')
        this.importURI(node, link, manager)

        const text = el.find('text')
        if (text) {
            text.children.forEach((child) => {
                const childNode = converter.convertElement(child)
                node.nodes.push(childNode.id)
            })
        } else {
            const paragraphTextNode = $$('element').attr('type', 'body')
            const paragraphNode = converter.convertElement(paragraphTextNode)
            paragraphNode.id = uuid('paragraph')
            node.nodes.push(paragraphNode.id)
        }

        // Import fields
        const dataEl = el.find('data')
        if (dataEl) {
            dataEl.children.forEach((child) => {
                this.importField(child, node, converter)
            })
        }

        // If title was not set by data > title
        if (!node.fields.title) {
            node.fields.title = el.attr('title') ? el.attr('title') : ''
        }
    },

    importURI: function(node, link, manager) {
        const configuredURIs = manager.getContentPartTypes().map(type => type.uri)
        if (link && configuredURIs.includes(link.attr('uri'))) {
            node.contentPartUri = link.attr('uri')
        } else {
            if (link && link.attr('uri')) {
                console.warn(`Imported content part type "${link.attr('uri')}" was not found in config. Using default type.`)
            } else {
                console.warn(`Imported content part type was not found in config. Using default type.`)
            }
            node.contentPartUri = manager.getDefaultContentPartType().uri
        }
    },

    importField: function(field, node, converter) {
        const tagName = field.el.tagName
        if (tagName === 'text') {
            return
        }

        if (!node.fields[tagName]) {
            node.fields[tagName] = converter.annotatedText(field, [node.id, 'fields', tagName])
        }
    },

    /**
     * Export a contentpart to NewsML.
     */
    export: function(node, el, converter) {
        const manager = new ContentPartManager(node)
        const $$ = converter.$$

        const uri = node.contentPartUri
        const contentPart = uri ? manager.getContentPartTypeByURI(uri) : manager.getDefaultContentPartType()

        el.attr({
            id: node.id,
            type: 'x-im/content-part'
        })

        if(node.uuid) {
            el.attr({
                uuid: node.uuid
            })
        }

        // Convert fields
        const fields = contentPart.fields.map(field => {
            if (node.fields[field.id]) {
                const fieldText = converter.annotatedText([node.id, 'fields', field.id])
                if (field.id === 'title' && this.titleAttributeDisabled === false) {
                    this.setTitleAttribute(el, node.fields[field.id])
                }
                return $$(field.id).append(fieldText)
            } else if (field.id === 'text') {
                return $$('text').attr('format', 'idf').append(converter.convertContainer(node))
            } else {
                return ''
            }
        })

        el.append($$('data').append(fields))

        // Export inline-text link if any (optional)
        if (uri) {
            el.append(
                $$('links').append(
                    $$('link').attr({
                        uri: uri,
                        rel: 'content-part'
                    })
                )
            )
        }
    },

    get titleAttributeDisabled() {
        return api.getConfigValue('se.infomaker.contentpart', 'disableTitleAttribute', false)
    },

    setTitleAttribute: (el, text) => {
        el.attr('title', text)
    }

}

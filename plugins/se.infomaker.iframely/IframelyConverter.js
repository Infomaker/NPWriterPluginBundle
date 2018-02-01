import {OEmbedExporter} from 'writer'

const IframelyConverter = {
    type: 'iframely',
    tagName: 'object',
    matchElement: function(el) {
        // Match all object tags with type attribute x-im/iframely
        return el.is(`${this.tagName}[type="x-im/${this.type}"]`)
    },

    // Convert newsml to node
    import: function(el, node) {
        if (el.attr('uuid')) {
            node.uuid = el.attr('uuid')
        }

        const titleElem = el.find('title')
        const embedCodeElem = el.find('embedCode')

        node.dataType = el.attr('type')
        node.url = el.attr('url')

        if (titleElem) {
            node.title = titleElem.text()
        }

        if (embedCodeElem) {
            node.embedCode = embedCodeElem.text()
        }
    },

    // Convert node to newsml
    export: function(node, el, converter) {
        const $$ = converter.$$
        const dataElem = $$('data')
        const titleElem = $$('title')
        const embedCodeElem = $$('embedCode')

        if (node.uuid) {
            el.attr('uuid', node.uuid)
        }
        el.attr('type', node.dataType)
        el.attr('url', node.url)

        titleElem.append(String(node.title))

        if (node.embedCode) {
            embedCodeElem.innerHTML = '<![CDATA[' + node.embedCode.replace(']]>', ']]&gt;') + ']]>'
        }

        dataElem.append([titleElem, embedCodeElem])
        el.append(dataElem)

        const oembed = node.oembed
        const linksEl = $$('links')

        this._appendAlternateHtml(node, linksEl, converter)
        this._appendAlternateImage(oembed, $$, linksEl)

        el.append(linksEl)
    },

    /**
     * @param {object} oembed
     * @param $$
     * @param linksEl
     * @private
     */
    _appendAlternateImage(oembed, $$, linksEl) {
        if (oembed.thumbnail_url) {
            const alternateImageLink = $$('link')
            const imageData = $$('data')

            // Create the image/alternate
            alternateImageLink.attr({
                rel: 'alternate',
                type: 'image/jpg',
                url: oembed.thumbnail_url
            })

            // Check if we have width and height of thumbail
            if (oembed.thumbnail_width) {
                imageData.append($$('width').append(oembed.thumbnail_width))
            }
            if (oembed.thumbnail_height) {
                imageData.append($$('height').append(oembed.thumbnail_height))
            }
            if (imageData.childNodes.length > 0) {
                alternateImageLink.append(imageData)
            }

            linksEl.append(alternateImageLink)
        }
    },

    /**
     * @param node
     * @param linksEl
     * @param converter
     * @private
     */
    _appendAlternateHtml(node, linksEl, converter) {
        const api = converter.context.api
        const configLabel = api.getConfigValue('se.infomaker.iframely', 'alternateLinkTitle', '{text}')
        const {oembed, url} = node
        const {$$} = converter
        const {description, provider_name: providerName} = oembed

        const oembedExporter = new OEmbedExporter(oembed)
        const context = this._getContextForProvider(api, oembedExporter)

        const alternateLink = $$('link')
        const title = oembedExporter.getTitle(configLabel)

        alternateLink.attr({
            rel: 'alternate',
            type: 'text/html',
            title,
            url
        })

        const dataEl = $$('data')

        if (context) {
            dataEl.append($$('context').append(context.context))
        }
        if (description) {
            dataEl.append($$('description').append(description.trim()))
        }
        if (providerName) {
            dataEl.append($$('provider').append(providerName.trim()))
        }

        if (dataEl.childNodes.length > 0) {
            alternateLink.append(dataEl)
        }

        linksEl.append(alternateLink)
    },

    /**
     *
     * @param api
     * @param {OEmbedExporter} oembedExporter
     * @returns string|boolean
     * @private
     */
    _getContextForProvider(api, oembedExporter) {
        const defaultContexts = {
            'Video': ['youtube', 'vimeo'],
            'Social': ['instagram', 'twitter', 'facebook']
        }
        const configuredContexts = api.getConfigValue('se.infomaker.iframely', 'contexts', {})

        return oembedExporter.getContext(configuredContexts, defaultContexts)
    }
}

export default IframelyConverter

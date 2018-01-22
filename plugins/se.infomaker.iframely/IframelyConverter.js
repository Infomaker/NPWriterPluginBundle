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

        const api = converter.context.api
        let configLabel = api.getConfigValue('se.infomaker.iframely', 'alternateLinkTitle', '{text}')

        const oembed = node.oembed
        const alternateLink = converter.$$('link')
        const linksEl = $$('links')

        const title = configLabel.replace('{author_name}', oembed.author)
            .replace('{author_url}', oembed.author_url)
            .replace('{provider_name}', oembed.provider_name)
            .replace('{text}', oembed.title ? oembed.title : '')

        alternateLink.attr({
            rel: 'alternate',
            type: 'text/html',
            url: node.url,
            title: title
        })

        linksEl.append(alternateLink)

        if(oembed.thumbnail_url) {
            const alternateImageLink = $$('link')
            const imageData = $$('data')

            // Create the image/alternate
            alternateImageLink.attr({
                rel: 'alternate',
                type: 'image/jpg',
                url: oembed.thumbnail_url
            })

            // Check if we have width and height of thumbail
            if(oembed.thumbnail_width) {
                imageData.append($$('width').append(oembed.thumbnail_width))
            }
            if(oembed.thumbnail_height) {
                imageData.append($$('height').append(oembed.thumbnail_height))
            }
            if(imageData.childNodes.length > 0) {
                alternateImageLink.append(imageData)
            }

            linksEl.append(alternateImageLink)
        }

        el.append(linksEl)
    }
}

export default IframelyConverter

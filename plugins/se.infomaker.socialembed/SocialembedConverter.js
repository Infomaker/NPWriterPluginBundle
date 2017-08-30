const socialEmbedConverter = {
    type: 'socialembed',
    tagName: 'object',

    matchElement: function (el) {
        return el.is('object[type="x-im/socialembed"]');
    },

    import: function (el, node) {
        node.dataType = el.attr('type')

        const linkEl = el.find('links>link[rel="self"]')
        node.url = linkEl.attr('url')
        node.uri = linkEl.attr('uri')
        node.linkType = linkEl.attr('type')
    },

    export: function (node, el, converter) {
        const $$ = converter.$$;

        el.attr({
            id: node.id,
            type: node.dataType
        });

        el.removeAttr('data-id');

        const links = $$('links'),
            link = $$('link')

        link.attr({
            rel: 'self',
            type: node.linkType,
            url: node.url,
            uri: node.uri
        });
        links.append(link)

        const alternateLink = socialEmbedConverter._addAlternateLink(node.linkType, node, converter)
        links.append(alternateLink)

        el.append(links);
    },

    _addAlternateLink: (linkType, node, converter) => {

        const links = new Map()
        links.set('x-im/instagram', socialEmbedConverter._createAlternateLinkForInstagram.bind(socialEmbedConverter))

        const linkCreator = links.get(linkType)

        return linkCreator ? linkCreator(node, converter) : socialEmbedConverter._createDefaultAlternateLink(node, converter)
    },


    _createTitleForAlternateLink: (linkType, data, converter) => {

        const configKeysForLinkType = new Map()
        configKeysForLinkType.set('x-im/instagram', 'alternateInstagramTitle')
        configKeysForLinkType.set('x-im/tweet', 'alternateTwitterTitle')
        configKeysForLinkType.set('x-im/facebook-post', 'alternateFacebookTitle')

        let configKey = configKeysForLinkType.get(linkType)
        if(!configKey) {
            configKey = 'alternateDefaultTitle'
        }
        let configLabel = converter.context.api.getConfigValue('se.infomaker.socialembed', configKey, '{author_name} posted on {provider_name}')

        configLabel = configLabel.replace('{author_name}', data.author_name)
        configLabel = configLabel.replace('{author_url}', data.author_url)
        configLabel = configLabel.replace('{provider_name}', data.provider_name)
        configLabel = configLabel.replace('{provider_url}', data.provider_url)
        configLabel = configLabel.replace('{text}', data.title ? data.title : '')
        return configLabel
    },

    /**
     * Create a default alternate link containing the URL to the resource
     * @param node
     * @param converter
     * @returns {*}
     * @private
     */
    _createDefaultAlternateLink: (node, converter) => {
        const alternateLink = converter.$$('link')
        alternateLink.attr({
            rel: 'alternate',
            type: 'text/html',
            url: node.url,
            title:  socialEmbedConverter._createTitleForAlternateLink(node.linkType, node.oembed, converter)
        })
        return alternateLink
    },


    /**
     * For Instagram we need to create two links, one for the url itself and another for the thumbnail
     * @param node
     * @param converter
     * @returns {[*,*]}
     * @private
     */
    _createAlternateLinkForInstagram: (node, converter) => {



        const $$ = converter.$$
        const alternateLink = $$('link'),
            alternateImageLink = $$('link'),
            imageData = $$('data')

        // Create the text/html link
        alternateLink.attr({
            rel: 'alternate',
            type: 'text/html',
            url: node.url,
            title: socialEmbedConverter._createTitleForAlternateLink(node.linkType, node.oembed, converter)
        })

        // Create the image/alternate
        alternateImageLink.attr({
            rel: 'alternate',
            type: 'image/jpg',
            url: node.oembed.thumbnail_url
        })

        // Check if we have width and height of thumbail
        if(node.oembed.thumbnail_width) {
            imageData.append($$('width').append(node.oembed.thumbnail_width))
        }
        if(node.oembed.thumbnail_height) {
            imageData.append($$('height').append(node.oembed.thumbnail_height))
        }

        if(imageData.childNodes.length > 0) {
            alternateImageLink.append(imageData)
        }
        return [alternateLink, alternateImageLink]
    },

    /**
     * 
     * @param converter
     * @returns {*|string|null}
     * @private
     */
    _getTranslatableTitle: (converter) => {
        const api = converter.context.api
        const configLabel = api.getConfigValue('se.infomaker.socialembed', 'alternateLinkTitle', 'Click link to view content')

        return api.getLabel(configLabel)
    }


}

export default socialEmbedConverter
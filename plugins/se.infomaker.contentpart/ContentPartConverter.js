import {api} from 'writer'

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
    import: (el, node, converter) => {
        node.id = el.attr('id')
        node.title = el.attr('title')

        if (el.find('subject')) {
            node.vignette = el.find('subject').text()
        }

        // Get inline-text link if any (optional)
        const link = el.find('links > link[rel="content-part"]')
        if (link) {
            node.contentpartUri = link.attr('uri')
        }

        const text = el.find('text')
        if(text) {
            text.children.forEach((child) => {
                const childNode = converter.convertElement(child)
                node.nodes.push(childNode.id)
            })
        }
    },

    /**
     * Export a contentpart to NewsML.
     */
    export: (node, el, converter) => {
        const $$ = converter.$$
        const output = api.getConfigValue('se.infomaker.contentpart', 'output', 'idf')

        // If we need to enable support for another type.
        //const type = api.getConfigValue('se.infomaker.contentpart', 'type', 'x-im/content-part')
        const type = 'x-im/content-part'

        const text = $$('text')
            .attr('format', output)

        let children
        if('html' === output) {
            console.warn('HTML output not yet implemented')
            // converter = writer.api.configurator.createExporter('html')
            // children = converter.convertContainer(node)
            // text.innerHTML = $$('content').append(children).innerHTML
        } else if('idf' === output) {
            children = converter.convertContainer(node)
            text.append(children)
        } else {
            throw new Error('Not a valid output format')
        }
        el.removeAttr('id')
        el.attr({
            id: node.id,
            type: type,
            title: node.title,
        })

        // Wrap contents in CDATA tags to please the XML gods.
        // const html = '<![CDATA[' + filter.output().replace(']]>', ']]&gt;') + ']]>'
        // const text = $$('text').append(children)
        // text.innerHTML = html
        text.attr('format', output)

        const vignette = $$('subject').append(node.vignette)
        el.append($$('data').append([vignette, text]))

        // Export inline-text link if any (optional)
        if (node.contentpartUri) {
            const link = $$('link').attr({
                uri: node.contentpartUri,
                rel: 'content-part'
            })
            el.append($$('links').append(link))
        }
    }
}

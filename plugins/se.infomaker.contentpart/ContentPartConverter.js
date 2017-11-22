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
            node.subject = el.find('subject').text()
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

        const type = 'x-im/content-part'

        const text = $$('text')
            .attr('format', output)

        let children
        if('html' === output) {
            console.warn('HTML output not yet implemented')
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

        text.attr('format', output)

        const subject = $$('subject').append(node.subject)
        el.append($$('data').append([subject, text]))

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

import { DefaultDOMElement } from 'substance'
import { idGenerator } from 'writer'
import DOMFilter from './DOMFilter'
import ContainerContent from './ContainerContent'

/**
 * Converts between NewsML and editor nodes.
 */
export default {
    type: 'factbox',
    tagName: 'object',

    matchElement: (el) => {
        return el.is('object') && el.attr('type') === 'x-cmbr/fact'
    },

    /**
     * Import a factbox element from NewsML.
     */
    import: (el, node, converter) => {
        node.id = el.attr('id')
        node.title = el.attr('title')

        if (el.find('subject')) {
            node.vignette = el.find('subject').text()
        }

        // Create the container node that holds our fact text.
        const container = converter.createNode({
            type: 'container',
            id: node.id + '-container',
            nodes: []
        })

        node.nodes = [container.id]

        /*
         Create a new `div` that is used to "parse" our HTML string by setting it to the wrappers `innerHTML`.
         We then loop each of the created paragraph nodes and create `DefautltDOMElement`s from those.
         Those elements can then be used to use the `annotatedText` function on the converter to create annotated
         editor nodes that we append to our container node.
         */
        const text = el.find('text').text()
        const wrapper = document.createElement('div')
        wrapper.innerHTML = text
        const paragraphs = Array.prototype.slice.call(wrapper.childNodes)
        paragraphs.map((p) => new DefaultDOMElement.parseHTML(p.outerHTML)).forEach((p) => {
            const pNode = converter.createNode({
                type: 'paragraph',
                id: idGenerator(),
            })
            container.nodes.push(pNode.id)
            pNode.content = converter.annotatedText(p, [pNode.id, 'content'])
        })
    },

    /**
     * Export a factbox to NewsML.
     */
    export: (node, el, converter) => {
        const id = node.id
        const nodes = node.document.getNodes()
        const container = Object.keys(nodes)
            .map((key) => nodes[key])
            .filter((itm) => itm.id === id + '-container')
            .pop()

        const containerContent = new ContainerContent(container, converter)
        const filter = new DOMFilter(containerContent.fragment(), containerContent.tagNames())

        const $$ = converter.$$
        el.removeAttr('id')
        el.attr({
            id: node.id,
            type: 'x-cmbr/fact',
            title: node.title,
        })

        // Wrap contents in CDATA tags to please the XML gods.
        const html = '<![CDATA[' + filter.output().replace(']]>', ']]&gt;') + ']]>'
        const text = $$('text')
        text.innerHTML = html
        text.attr('format', 'html')

        const vignette = $$('subject').append(node.vignette)
        el.append($$('data').append([vignette, text]))
    }
}

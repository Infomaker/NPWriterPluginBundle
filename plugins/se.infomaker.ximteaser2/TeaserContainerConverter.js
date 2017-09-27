export default {

    type: 'ximteasercontainer',
    tagName: 'object',

    matchElement: (el) => {
        return el.is('object') && el.attr('type') === 'x-im/teasercontainer'
    },

    import: (el, node, converter) => {
        node.nodes = el.children.map((child) => {
            const childNode = converter.convertElement(child)
            return childNode.id
        })
    },

    export: (node, el, converter) => {
        el.attr('type', 'x-im/teasercontainer')
        const elements = node.nodes.map(node => converter.convertNode(node))
        el.append(elements)
    }
}
const IframelyConverter = {
    type: 'iframely',
    tagName: 'object',
    matchElement: function(el) {
        // Match all object tags with type attribute x-im/iframely
        return el.is(`${this.tagName}[type="x-im/${this.type}"]`)
    },

    // Convert newsml to node
    import: function(el, node) {
        if (el.attr('uuid')) { node.uuid = el.attr('uuid') }

        const embedCodeElem = el.find('embedCode')

        node.dataType = el.attr('type')
        node.url = el.attr('url')
        node.embedCode = embedCodeElem.text()
    },

    // Convert node to newsml
    export: function(node, el, converter) {
        const $$ = converter.$$
        const dataElem = $$('data')
        const embedCodeElem = $$('embedCode')

        if (node.uuid) { el.attr('uuid', node.uuid) }
        el.attr('type', node.dataType)
        el.attr('url', node.url)

        embedCodeElem.innerHTML = '<![CDATA[' + node.embedCode.replace(']]>', ']]&gt;') + ']]>'

        dataElem.append(embedCodeElem)
        el.append(dataElem)
    }
}

export default IframelyConverter

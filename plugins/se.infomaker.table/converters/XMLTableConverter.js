import HTMLTableConverter from './HTMLTableConverter'

export default {
    type: 'table',
    tagName: 'object',

    matchElement: function(el) {
        // Match all object tags with type attribute x-im/table
        return el.is(`${this.tagName}[type="x-im/${this.type}"]`)
    },

    // From newsml to node
    import: function (el, node, converter) {
        // The HTML table importer will work as is
        HTMLTableConverter.import(el, node, converter)
    },

    // From node to newsml
    export: function (node, el, converter) {
        // Set object type
        el.attr('type', `x-im/${this.type}`)

        // Create data element to which we will append the converted table
        const dataElem = converter.$$('data')

        // Use the HTML table exporter to append table to dataElem
        HTMLTableConverter.export(node, dataElem, converter)

        el.append(dataElem)
        return el
    }
}

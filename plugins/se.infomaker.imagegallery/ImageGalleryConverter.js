
const ImageGalleryConverter = {
    type: 'imagegallery',
    tagName: 'object',
    dataType: 'x-im/imagegallery',

    matchElement(el) {
        return (el.is(`${this.tagName}`) && el.attr("type") === this.dataType)
    },

    /**
     * newsml to Substance node
     * 
     * @param {any} el 
     * @param {any} node 
     */
    import(el, node) {
        node.dataType = el.attr('type')
    },

    /**
     * Substance node to newsml
     * 
     * @param {any} node 
     * @param {any} el 
     * @param {any} converter 
     */
    export(node, el, converter) {
        const {$$} = converter
        el.attr('type', node.dataType)
    }
}

export default ImageGalleryConverter
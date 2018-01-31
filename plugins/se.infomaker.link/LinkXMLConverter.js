/*
 * HTML converter for Paragraphs.
 */
export default {

    type: "link",
    tagName: 'a',

    import: function(el, node) {
        node.url = el.attr('href')
    },

    export: function(link, el) {
        el.attr({
            href: link.url,
        })
    }

}

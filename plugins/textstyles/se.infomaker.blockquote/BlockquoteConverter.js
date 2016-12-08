export default {
    type: "blockquote",
    tagName: "element",

    matchElement: function (el) {
        return el.is('element[type="blockquote"]')
    },

    import: function (el, node, converter) {
        var state = converter.state;
        var oldValue = state.trimWhitespaces;
        state.trimWhitespaces = true;
        node.content = converter.annotatedText(el, [node.id, 'content']/*, { trimWhitespaces: true } */);
        state.trimWhitespaces = oldValue;
    },

    export: function (node, el, converter) {
        el.attr('type', 'blockquote')
            .append(converter.annotatedText([node.id, 'content']));
    }

}

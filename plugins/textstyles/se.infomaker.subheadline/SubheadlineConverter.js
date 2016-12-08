export default {
    type: "subheadline",
    tagName: "element",

    matchElement: function(el) {
        return /subheadline\d$/.exec(el.attr('type'));
    },

    import: function(el, node, converter) {
        var state = converter.state;
        var oldValue = state.trimWhitespaces;

        state.trimWhitespaces = true;
        node.content = converter.annotatedText(el, [node.id, 'content']/*, { trimWhitespaces: true } */);
        node.level = parseInt(String(el.attr('type')[11]), 10);
        state.trimWhitespaces = oldValue;
    },

    export: function(node, el, converter) {
        el.attr({
            type: node.contentType,
            format: node.format
        })

        return el.attr('type', 'subheadline'+node.level)
            .append(converter.annotatedText([node.id, 'content']));
    }
}

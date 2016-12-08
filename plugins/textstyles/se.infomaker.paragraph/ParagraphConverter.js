export default {
    type: "paragraph",
    tagName: "element",

    matchElement: function (el) {
        return el.is('element[type="body"]') || el.is('element[type="paragraph"]');
    },

    import: function (el, node, converter) {
        var state = converter.state;
        var oldValue = state.trimWhitespaces;
        state.trimWhitespaces = true;
        node.content = converter.annotatedText(el, [node.id, 'content']/*, { trimWhitespaces: true } */);
        state.trimWhitespaces = oldValue;
    },

    export: function (node, el, converter) {
        el.attr('type', 'body')
            .append(converter.annotatedText([node.id, 'content']));
    }

}

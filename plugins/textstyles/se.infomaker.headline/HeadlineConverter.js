export default {
    type: "headline",
    tagName: "element",

    matchElement: function (el) {
        return el.is('element[type="headline"]');
    },

    import: function (el, node, converter) {
        var state = converter.state;
        var oldValue = state.trimWhitespaces;
        state.trimWhitespaces = true;
        node.content = converter.annotatedText(el, [node.id, 'content']/*, { trimWhitespaces: true } */);
        state.trimWhitespaces = oldValue;
    },

    export: function (node, el, converter) {
        return el.attr('type', 'headline')
            .append(converter.annotatedText([node.id, 'content']));
    }
}
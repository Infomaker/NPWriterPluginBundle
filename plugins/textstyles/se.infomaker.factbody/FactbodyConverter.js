export default {

    tagName: 'element',

    matchElement: function (el) {
        return el.is('element[type="fact-body"]');
    },

    import: function (el, node, converter) {
        const state = converter.state;
        const oldValue = state.trimWhitespaces;
        state.trimWhitespaces = true;
        node.content = converter.annotatedText(el, [node.id, 'content']/*, { trimWhitespaces: true } */);
        state.trimWhitespaces = oldValue;
    },

    export: function (node, el, converter) {
        return el.attr('type', 'fact-body')
            .append(converter.annotatedText([node.id, 'content']));
    }
};


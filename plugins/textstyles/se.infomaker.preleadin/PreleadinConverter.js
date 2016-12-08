export default {

    tagName: 'element',

    matchElement: function (el) {
        return el.is('element[type="preleadin"]');
    },

    import: function (el, node, converter) {
        node.content = converter.annotatedText(el, [node.id, 'content']);
    },

    export: function (node, el, converter) {
        return el.attr('type', 'preleadin')
            .append(converter.annotatedText([node.id, 'content']));
    }
};


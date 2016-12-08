export default {

    tagName: 'element',

    matchElement: function (el) {
        return el.is('element[type="pagedateline"]');
    },

    import: function (el, node, converter) {
        node.content = converter.annotatedText(el, [node.id, 'content']);
    },

    export: function (node, el, converter) {
        return el.attr('type', 'pagedateline')
            .append(converter.annotatedText([node.id, 'content']));
    }
};


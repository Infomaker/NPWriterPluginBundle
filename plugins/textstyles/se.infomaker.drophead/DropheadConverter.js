export default {

    tagName: 'element',

    matchElement: function (el) {
        return el.is('element[type="drophead"]');
    },

    import: function (el, node, converter) {
        node.content = converter.annotatedText(el, [node.id, 'content']);
    },

    export: function (node, el, converter) {
        return el.attr('type', 'drophead')
            .append(converter.annotatedText([node.id, 'content']));
    }
};


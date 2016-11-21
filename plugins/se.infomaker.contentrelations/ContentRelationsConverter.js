var ContentRelationsConverter = {
    type: 'contentrelations',
    tagName: 'object',

    matchElement: function(el) {
        return el.is('object') && el.attr('type') === 'x-im/link';
    },

    import: function(el, node) { // jshint ignore:line
        if (el.attr('uuid')) {
            node.uuid = el.attr('uuid');
        }

        node.label = el.attr('title');
        node.dataType = el.attr('type');
    },

    export: function(node, el, converter) {
        if (node.uuid) {
            el.attr('uuid', node.uuid);
        }

        el.attr('title', node.label);
        el.attr('type', node.dataType);

        var links = converter.$$('links');
        var link = converter.$$('link');

        link.attr({rel:'self', type:'x-im/article'});

        if (node.uuid) {
            link.attr('uuid', node.uuid);
        }

        links.append(link);
        el.append(links);
    }
};
export default ContentRelationsConverter

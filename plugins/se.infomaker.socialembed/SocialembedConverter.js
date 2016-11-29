export default {
    type: 'socialembed',
    tagName: 'object',

    matchElement: function(el) {
        return el.is('object[type="x-im/socialembed"]');
    },

    import: function(el, node) {
        node.dataType = el.attr('type')

        const linkEl = el.find('links>link')
        node.url = linkEl.attr('url')
        node.uri = linkEl.attr('uri')
        node.linkType = linkEl.attr('type')
    },

    export: function(node, el, converter) {
        const $$ = converter.$$;

        el.attr({
            id: node.id,
            type: node.dataType
        });

        el.removeAttr('data-id');

        const links = $$('links');
        const link = $$('link');

        link.attr({
            rel: 'self',
            type: node.linkType,
            url: node.url,
            uri: node.uri
        });

        links.append(link);
        el.append(links);
    }
}

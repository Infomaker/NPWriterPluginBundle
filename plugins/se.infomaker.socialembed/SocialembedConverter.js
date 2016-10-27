export default {
    type: 'socialembed',
    tagName: 'object',

    matchElement: function(el) {
        return el.is('object[type="x-im/socialembed"]');
    },

    import: function(el, node) {
        node.dataType = el.attr('type')
        /*
          {
          "id": "p2ok447mofmi",
          "type": ”x-im/socialembed",
          "links": [
              {
                "rel": "self",
                "type": ”x-im/tweet",
                "url": "https://twitter.com/fraserspeirs/status/694515217666064385",
                "uri": "x-im://tweet/694515217666064385"
              }
            ]
          }
        */
        var linkEl = el.find('links>link');
        node.url = linkEl.attr('url');
        node.uri = linkEl.attr('uri');
        node.linkType = linkEl.attr('type');
        node.html = linkEl.innerHTML;
    },

    export: function(node, el, converter) {
        var $$ = converter.$$;

        el.attr({
            id: node.id,
            type: node.dataType
        });

        el.removeAttr('data-id');

        var links = $$('links');
        var link = $$('link');
        link.attr({
            rel: 'self',
            type: node.linkType,
            url: node.url,
            uri: node.uri
        });
        link.innerHTML = node.html

        links.append(link);
        el.append(links);
    }
}

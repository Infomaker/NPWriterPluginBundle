'use strict';

var HtmlembedConverter = {
    type: 'htmlembed',
    tagName: 'object',

    matchElement: function(el) {
        return el.is('object') && el.attr('type') == 'x-im/htmlembed';
    },

    import: function(el, node, converter) { // jshint ignore:line
        if (el.attr('uuid')) {
            node.uuid = el.attr('uuid');
        }

        node.id = el.attr('id');

        node.contentType = el.attr('type');

        var dataEl = el.find('data');
        dataEl.children.forEach(function(child) {
            if (child.tagName == 'text') {
                node.text = child.text();
            }

            if (child.tagName == 'format') {
                node.format = child.text();
            }
        });
    },

    export: function(node, el, converter) {
        if (node.uuid) {
            el.attr('uuid', node.uuid);
        }

        el.attr('type', node.contentType);
        el.attr('id', node.id);
        el.removeAttr('data-id');

        el.append(
            converter.$$('data').append([
                converter.$$('text').append(
                    '<![CDATA[' + node.text.replace(']]>', ']]&gt;') + ']]>'
                ),
                converter.$$('format').append(
                    converter.annotatedText([node.id, 'format'])
                )]
            )
        );
    }
};

module.exports = HtmlembedConverter;

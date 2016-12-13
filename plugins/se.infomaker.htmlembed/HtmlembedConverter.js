const HtmlembedConverter = {
    type: 'htmlembed',
    tagName: 'object',

    matchElement: function(el) {
        return el.is('object') && el.attr('type') === 'x-im/htmlembed';
    },

    import: function(el, node, converter) { // jshint ignore:line
        if (el.attr('uuid')) {
            node.uuid = el.attr('uuid');
        }

        node.id = el.attr('id');

        node.dataType = el.attr('type');

        const dataEl = el.find('data');
        dataEl.children.forEach(function(child) {
            if (child.tagName === 'text') {
                // let html =  child.text().replace('<![CDATA[', '')
                // html.replace()
                node.text = child.text();
            }

            if (child.tagName === 'format') {
                node.format = child.text();
            }
        });
    },

    export: function(node, el, converter) {
        const $$ = converter.$$

        if (node.uuid) {
            el.attr('uuid', node.uuid);
        }

        el.attr('type', node.dataType);
        el.attr('id', node.id);
        el.removeAttr('data-id');

        const data = $$('data')

        const text = $$('text')
        const html = '<![CDATA[' + node.text.replace(']]>', ']]&gt;') + ']]>'
        text.innerHTML = html

        const format = $$('format')
        format.append(converter.annotatedText([node.id, 'format']))

        data.append([text, format])
        el.append(data)

    }
};

export default HtmlembedConverter

export default {
    type: 'news-priority',
    matchElement: function(el) {
        return el.is('object[type="x-im/newsvalue"]')
    },

    // <object id="RYaudnAJj8gQ" type="x-im/newsvalue"><data><score>3</score><description>30D</description><text>PT6H</text><format>lifetimecode</format><end></end><duration>2538000</duration></data></object></metadata>

    import: function(el, node) {
        let data = el.find('data')
        if (!data) throw new Error('<data> is mandatory for x-im/newsvalue')
        node.score = Number(data.find('score').textContent)
        node.description = data.find('description').textContent
        node.format = data.find('format').textContent
        node.duration = Number(data.find('duration').textContent)
        let end = data.find('end')
        if (end) {
            node.end = end.textContent
        }
    },

    export: function(node, el, converter) {
        const $$ = converter.$$
        el.tagName = 'object'
        el.attr('type', 'x-im/newsvalue')
        let data = $$('data')
        data.append($$('score').text(node.score))
        data.append($$('description').text(node.description))
        data.append($$('format').text(node.format))
        data.append($$('duration').text(node.duration))

        if(node.end) {
            data.append($$('end').text(node.end))
        }

        el.append(data)

        return el
    }
}
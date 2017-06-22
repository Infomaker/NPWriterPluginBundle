export default {
    type: 'publishflow',
    tagName: 'object',

    matchElement: function(el) {
        return el.is('pubStatus') || el.is('itemMetaExtProperty[type="imext:pubstart"]') || el.is('itemMetaExtProperty[type="imext:pubstop"]')
    },

    // <object id="RYaudnAJj8gQ" type="x-im/newsvalue"><data><score>3</score><description>30D</description><text>PT6H</text><format>lifetimecode</format><end></end><duration>2538000</duration></data></object></metadata>

    import: function(el, node) {

        node.id = 'publishflow'

        if(el.is('pubStatus')) {
            node.pubStatus = el.attr('qcode')
        }
        if(el.is('itemMetaExtProperty[type="imext:pubstart"]')) {
            node.pubStart = el.attr('value')
        }
        if(el.is('itemMetaExtProperty[type="imext:pubstop"]')) {
            node.pubStop = el.attr('value')
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
        // data.append($$('duration').text(node.duration))

        if(node.end) {
            data.append($$('end').text(node.end))
        }

        el.append(data)

        return el
    }
}
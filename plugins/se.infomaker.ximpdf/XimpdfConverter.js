import {NilUUID, idGenerator, api} from 'writer'

export default {
    type: 'ximpdf',
    tagName: 'object',

    matchElement: function (el) {
        return el.is('object') && el.attr('type') === 'x-im/pdf'
    },

    import: function (el, node, converter) { // jshint ignore:line

        // Import link - base data
        var linkEl = el.find('links>link')

        let pdfFile = {
            id: idGenerator(),
            type: 'ximpdffile',
            fileType: 'pdf'
        }
        if (el.attr('uuid')) {
            pdfFile.uuid = el.attr('uuid')
        }
        if (linkEl.attr('uri')) {
            pdfFile.uri = linkEl.attr('uri')
        }
        if (linkEl.attr('url')) {
            pdfFile.url = linkEl.attr('url')
        }

        converter.createNode(pdfFile)
        node.pdfFile = pdfFile.id

        node.uuid = el.attr('uuid')

        // Import data
        var dataEl = linkEl.find('data')
        if (dataEl) {
            dataEl.children.forEach(function (child) {
                if (child.tagName === 'text') {
                    //pdfFile.text = converter.annotatedText(child, [node.id, 'text'])
                    node.text = converter.annotatedText(child, [node.id, 'text'])
                }
            })
        }
    },

    export: function (node, el, converter) {
        var $$ = converter.$$;

        let fileNode = node.document.get(node.pdfFile)

        el.removeAttr('data-id')
        el.attr({
            id: node.id,
            type: 'x-im/pdf'
        })

        // Data element
        var data = $$('data').append([
            $$('text').append(String(node.text))
        ])

        el.attr('uuid', fileNode.uuid)

        // Link element
        var link = $$('link').attr({
            rel: 'self',
            type: 'x-im/pdf',
            uri: fileNode.uri ? fileNode.uri : '',
            uuid: fileNode.uuid ? fileNode.uuid : NilUUID.getNilUUID()
        }).append(data);

        // Links
        el.append(
            $$('links').append(
                link
            )
        )
    }
}


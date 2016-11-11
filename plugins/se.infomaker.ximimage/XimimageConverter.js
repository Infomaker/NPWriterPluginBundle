import {api, NilUUID, idGenerator} from 'writer'

export default {
    type: 'ximimage',
    tagName: 'object',

    matchElement: function (el) {
        return el.is('object') && el.attr('type') === 'x-im/image'
    },

    import: function (el, node, converter) { // jshint ignore:line

        // Import link - base data
        var linkEl = el.find('links>link')

        let imageFile = {
            id: idGenerator(),
            type: 'npfile',
            fileType: 'image',
            parentNodeId: el.attr('id')
        }
        if (el.attr('uuid')) {
            imageFile.uuid = el.attr('uuid')
        }
        if (linkEl.attr('uri')) {
            imageFile.uri = linkEl.attr('uri')
        }
        if (linkEl.attr('url')) {
            imageFile.url = linkEl.attr('url')
        }
        converter.createNode(imageFile)
        node.imageFile = imageFile.id

        node.uuid = el.attr('uuid')

        // Import data
        var dataEl = linkEl.find('data')
        node.caption = ''
        node.alttext = ''
        node.credit = ''
        node.alignment = ''
        node.crops = {}

        if (dataEl) {
            dataEl.children.forEach(function (child) {
                if (child.tagName === 'text') {
                    node.caption = converter.annotatedText(child, [node.id, 'caption']);
                }

                if (child.tagName === 'alttext') {
                    node.alttext = converter.annotatedText(child, [node.id, 'alttext']);
                }

                if (child.tagName === 'credit') {
                    node.credit = converter.annotatedText(child, [node.id, 'credit']);
                }

                if (child.tagName === 'alignment') {
                    node.alignment = child.text();
                }

                if (child.tagName === 'width') {
                    node.width = parseInt(child.text(), 10)
                }

                if (child.tagName === 'height') {
                    node.height = parseInt(child.text(), 10)
                }

                if (child.tagName === 'crops' && child.children.length > 0) {
                    var crops = {crops: []};

                    child.children.forEach(function (crop) {
                        if (crop.children.length === 0) {
                            // Sanity check
                            return;
                        }

                        if (crop.tagName === 'width') {
                            crops.width = crop.text();
                        }
                        else if (crop.tagName === 'height') {
                            crops.height = crop.text();
                        }
                        else {
                            var x = crop.find('x'),
                                y = crop.find('y'),
                                width = crop.find('width'),
                                height = crop.find('height');

                            crops.crops.push({
                                name: crop.attr('name'),
                                x: x.text(),
                                y: y.text(),
                                width: width.text(),
                                height: height.text()
                            });
                        }
                    });

                    if (crops.crops.length) {
                        node.crops.original = crops;
                    }
                }
            })
        }

        // Import author links
        node.authors = []
        var authorLinks = linkEl.find('links')
        if (authorLinks) {
            authorLinks.children.forEach(function (authorLinkEl) {
                if ("author" === authorLinkEl.getAttribute('rel')) {
                    node.authors.push({
                        uuid: authorLinkEl.getAttribute('uuid'),
                        name: authorLinkEl.getAttribute('title')
                    })
                }
                else {
                    console.warn("Unhandled link in image object", authorLinkEl);
                }
            })
        }
    },

    export: function (node, el, converter) {
        var $$ = converter.$$;

        el.removeAttr('data-id')
        el.attr({
            id: node.id,
            uuid: node.uuid,
            type: 'x-im/image'
        })

        var data = $$('data').append([
            $$('width').append(String(node.width)),
            $$('height').append(String(node.height))
        ])

        var fields = window.writer.api.getConfigValue('se.infomaker.ximimage', 'fields') || []
        fields.forEach(obj => {
            let name = (obj.name === 'caption' ? 'text' : obj.name)
            if (obj.type === 'option') {
                data.append(
                    $$(name).append(node[obj.name])
                )
            }
            else {
                data.append(
                    $$(name).append(
                        converter.annotatedText([node.id, obj.name])
                    )
                )
            }
        })

        // Add crops to data
        var crops = []
        if (node.crops && node.crops.original) {
            var originalCrops = $$('crops')

            for (var x in node.crops.original.crops) {

                if (node.crops.original.crops.hasOwnProperty(x)) {
                    var origCrop = node.crops.original.crops[x];

                    originalCrops.append(
                        $$('crop').attr('name', origCrop.name).append([
                            $$('x').append(origCrop.x),
                            $$('y').append(origCrop.y),
                            $$('width').append(origCrop.width),
                            $$('height').append(origCrop.height)
                        ])
                    )
                }


            }

            crops.push(originalCrops);
        }

        if (crops.length) {
            data.append(crops);
        }

        let fileNode = node.document.get(node.imageFile)
        var link = $$('link').attr({
            rel: 'self',
            type: 'x-im/image',
            uri: fileNode.uri ? fileNode.uri : '',
            uuid: fileNode.uuid ? fileNode.uuid : NilUUID.getNilUUID()
        }).append(data);

        if (node.authors.length) {
            var authorLinks = $$('links');
            for (var n in node.authors) {
                if (node.authors.hasOwnProperty(n)) {
                    var authorLink = $$('link').attr({
                        rel: 'author',
                        uuid: node.authors[n].uuid,
                        title: node.authors[n].name
                    })

                    if (!NilUUID.isNilUUID(node.authors[n].uuid)) {
                        authorLink.attr('type', 'x-im/author')
                    }
                    authorLinks.append(authorLink);
                }
            }
            link.append(authorLinks)
        }

        el.append(
            $$('links').append(
                link
            )
        )
    }
}


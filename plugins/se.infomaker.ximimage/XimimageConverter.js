import {NilUUID, idGenerator, api} from 'writer'

export default {
    type: 'ximimage',
    tagName: 'object',

    matchElement: function (el) {
        return el.is('object') && el.attr('type') === 'x-im/image'
    },

    /**
     *
     * @param el
     * @param node
     * @param {NewsMLImporter} converter
     * @param {bool} newsItemConversion If the converter is used to convert a newsItem for a image (metadata from repository)
     */
    import: function (el, node, converter, newsItemConversion) {

        const objectElementId = el.attr('id')

        // Import link - base data
        var linkEl = el.find('links>link')

        let imageFile = {
            id: idGenerator(),
            type: 'npfile',
            imType: 'x-im/image',
            parentNodeId: objectElementId
        }

        if (el.attr('uuid')) {
            imageFile.uuid = el.attr('uuid')
        }

        if (linkEl && linkEl.attr('uri')) {
            node.uri = linkEl.attr('uri')
        }

        if (linkEl && linkEl.attr('url')) {
            imageFile.url = linkEl.attr('url')
        }

        converter.createNode(imageFile)
        node.imageFile = imageFile.id
        node.uuid = el.attr('uuid')

        let dataEl
        if(newsItemConversion) {
            dataEl = el.find('data')
        } else {
            dataEl = linkEl.find('data')
        }
        // Import data




        node.caption = ''
        node.alttext = ''
        node.credit = ''
        node.alignment = ''

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
                        node.crops = crops;
                    }
                }
            })
        }

        // Import author links
        node.authors = []
        let authorLinks
        if(newsItemConversion) {
            authorLinks = el.find('links')
        } else {
            authorLinks = linkEl.find('links')
        }

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

        let fileNode = node.document.get(node.imageFile)

        el.removeAttr('data-id')
        el.attr({
            id: node.id,
            type: 'x-im/image',
            uuid: fileNode.uuid ? fileNode.uuid : NilUUID.getNilUUID()
        })


        var data = $$('data').append([
            $$('width').append(String(node.width)),
            $$('height').append(String(node.height))
        ])

        let fields = api.getConfigValue('se.infomaker.ximimage', 'fields') || []
        fields.forEach(obj => {
            let name = (obj.name === 'caption' ? 'text' : obj.name)

            if (!node[obj.name]) {
                data.append($$(name).append(''))
            }
            else if (obj.type === 'option') {
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
        if (node.crops) {
            let crops = $$('crops')

            for (var x in node.crops.crops) {
                if (node.crops.crops.hasOwnProperty(x)) {
                    var origCrop = node.crops.crops[x];

                    crops.append(
                        $$('crop').attr('name', origCrop.name).append([
                            $$('x').append(origCrop.x),
                            $$('y').append(origCrop.y),
                            $$('width').append(origCrop.width),
                            $$('height').append(origCrop.height)
                        ])
                    )
                }
            }

            data.append(crops)
        }


        var link = $$('link').attr({
            rel: 'self',
            type: 'x-im/image',
            uri: node.uri ? node.uri : '',
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

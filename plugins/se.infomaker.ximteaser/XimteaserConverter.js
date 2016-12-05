import { idGenerator } from 'writer'


export default {
    type: 'ximteaser',
    tagName: 'object',

    matchElement: function (el) {
        return el.is('object') && el.attr('type') === 'x-im/teaser'
    },

    import: function (el, node, converter) { // jshint ignore:line
        // x-im/image attributes
        node.title = el.attr('title');
        node.dataType = el.attr('type');

        var linkEl = el.find('links>link');
        if (linkEl) {
            node.imageType = linkEl.attr('type');

            let imageFile = {
                id: idGenerator(),
                type: 'ximimagefile',
                fileType: 'image'
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

        }

        // Import data
        var dataEl = el.find('data')
        node.crops = {}

        if (dataEl) {
            dataEl.children.forEach(function(child) {
                if (child.tagName === 'text') {
                    node.text = converter.annotatedText(child, [node.id, 'text']);
                }

                if (child.tagName === 'subject') {
                    node.subject = converter.annotatedText(child, [node.id, 'subject']);
                }

                if (child.tagName === 'width') {
                    node.width = parseInt(child.text(), 10);
                }

                if (child.tagName === 'height') {
                    node.height = parseInt(child.text(), 10);
                }

                if (child.tagName === 'crops') {
                    var crops = {crops: []};

                    child.children.forEach(function(crop) {
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

                    node.crops.original = crops;
                }

            });
        }
    },



    export: function (node, el, converter) {
        var $$ = converter.$$;

        el.removeAttr('data-id');
        el.attr({
            id: node.id,
            type: 'x-im/teaser'
        });

        if(node.title) {
            el.attr('title',converter.annotatedText([node.id, 'title']));
        }

        // Data element
        var data = $$('data');
        if (node.text) {
            data.append($$('text').append(
                converter.annotatedText([node.id, 'text'])
            ));
        }

        if (node.subject) {
            data.append($$('subject').append(
                converter.annotatedText([node.id, 'subject'])
            ));
        }

        // Add crops to data
        var crops = [];
        if (node.crops && node.crops.original) {
            var originalCrops = $$('crops');

            for (var x in node.crops.original.crops) { // eslint-disable-line
                var origCrop = node.crops.original.crops[x];

                originalCrops.append(
                    $$('crop').attr('name', origCrop.name).append([
                        $$('x').append(origCrop.x),
                        $$('y').append(origCrop.y),
                        $$('width').append(origCrop.width),
                        $$('height').append(origCrop.height)
                    ])
                );
            }

            crops.push(originalCrops);
        }

        if (crops.length) {
            data.append(crops);
        }

        el.append(data);



        // Links
        if (node.uuid !== '' && node.uri) {
            var link = $$('link').attr({
                rel: 'image',
                type: 'x-im/image',
                uri: node.uri,
                uuid: node.uuid
            });

            el.append($$('links').append(link));
        }

    }
}

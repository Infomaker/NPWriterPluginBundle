import { idGenerator } from 'writer'


export default {
    type: 'ximteaser',
    tagName: 'object',

    matchElement: function (el) {
        return el.is('object') && el.attr('type') === 'x-im/teaser'
    },


    /**
     * Import teaser xml structure
     */
    import: function (el, node, converter) { // jshint ignore:line
        const nodeId = el.attr('id')
        node.title = el.attr('title') ? el.attr('title') : ''
        node.dataType = el.attr('type')

        // Import teaser data
        const dataEl = el.find('data')
        if (dataEl) {
            dataEl.children.forEach(function(child) {
                if (child.tagName === 'text') {
                    node.text = converter.annotatedText(child, [node.id, 'text'])
                }

                if (child.tagName === 'subject') {
                    node.subject = converter.annotatedText(child, [node.id, 'subject'])
                }

            })
        }

        // Handle image link in teaser
        const linkEl = el.find('links > link')
        if (linkEl) {
            node.imageType = linkEl.attr('type')

            let imageFile = {
                id: idGenerator(),
                type: 'npfile',
                imType: 'x-im/image',
                parentNodeId:nodeId
            }

            if (linkEl.attr('uuid')) {
                imageFile.uuid = linkEl.attr('uuid')
            }

            if (linkEl.attr('uri')) {
                node.uri = linkEl.attr('uri')
            }

            if (linkEl.attr('url')) {
                imageFile.url = linkEl.attr('url')
            }

            // If image data like width, height, crops is not found here it's
            // the old depcrecated format with image data in the teaser data.
            const linkDataEl = linkEl.find('data')
            if (linkDataEl) {
                // New format, image data is found correctly in link data element
                this.importImageLinkData(linkDataEl, node)
            }
            else {
                // Old, depcrecated format, image data is found in teaser data
                this.importImageLinkData(dataEl, node)
            }

            // Import softcrops if exists
            this.importSoftcrops(linkEl, node)

            converter.createNode(imageFile)
            node.imageFile = imageFile.id
            node.uuid = linkEl.attr('uuid')
        }
    },

    importImageLinkData: function(el, node) {
        el.children.forEach(function(child) {
            if (child.tagName === 'width') {
                node.width = parseInt(child.text(), 10)
            }

            if (child.tagName === 'height') {
                node.height = parseInt(child.text(), 10)
            }
        })
    },

    /**
     * Import the image link structure
     */
    importSoftcrops: function(el, node) {
        let links = el.find('links')
        if (!links || links.length <= 0) {
            return
        }

        let crops = {
            crops: []
        }

        links.children.forEach(function(link) {
            if (link.attr('type') !== 'x-im/crop') {
                return
            }

            let parsed = link.attr('uri').match(/im:\/\/crop\/(.*)/)
            if(!Array.isArray(parsed) || parsed.length !== 2) {
                return
            }

            let [x, y, w, h] = parsed[1].split('/')
            crops.crops.push({
                name: link.attr('title'),
                x: x,
                y: y,
                width: w,
                height: h
            })
        })

        if (crops.crops.length) {
            node.crops = crops
        }
    },

    /**
     * Export teaser in the following format:
     *
     * <object id="mb2" type="x-im/teaser" title="50-åring häktad för barnporrbrott">
     *   <data>
     *     <text>
     *       En man i 50-årsåldern som är anställd på en skola i Västerås häktades i dag på sannolika skäl
     *       misstänkt för utnyttjande av barn för sexuell posering, sexuellt ofredande och
     *       barnpornografibrott, rapporterar P4 Västmanland. Brotten omfattar sammanlagt fe
     *     </text>
     *     <subject>hnjnjnjnj</subject>
     *   </data>
     *   <links>
     *     <link rel="image" type="x-im/image" uri="im://image/oaVeImm6yCsoihzsKNAuFUAsOpY.jpg" uuid="631c8997-36c8-5d0d-9acd-68cc1856f87c">
     *       <data>
     *         <width></width>
     *         <height></height>
     *         <crops>...</crops>
     *       </data>
     *     </link>
     *   </links>
     * </object>
     *
     * @param el
     * @param node
     * @param converter
     */

    export: function (node, el, converter) {
        const $$ = converter.$$

        el.removeAttr('data-id')
        el.attr({
            id: node.id,
            type: 'x-im/teaser'
        })

        if(node.title) {
            el.attr('title', converter.annotatedText([node.id, 'title']))
        }

        // Data element
        const data = $$('data')
        if (node.text) {
            data.append($$('text').append(
                converter.annotatedText([node.id, 'text'])
            ))
        }

        if (node.subject) {
            data.append($$('subject').append(
                converter.annotatedText([node.id, 'subject'])
            ))
        }
        el.append(data)

        let fileNode = node.document.get(node.imageFile)

        // Links
        if (fileNode && fileNode.uuid !== '' && node.uri) {
            const link = $$('link').attr({
                rel: 'image',
                type: 'x-im/image',
                uri: node.uri,
                uuid: fileNode.uuid
            })
            const linkData = $$('data')

            // Add image data and crops to data
            if(node.width) {
                linkData.append(
                    $$('width').append(
                        String(node.width)
                    )
                )
            }
            if(node.height) {
                linkData.append(
                    $$('height').append(
                        String(node.height)
                    )
                )
            }

            link.append(linkData)

            if (node.crops) {
                let cropLinks = $$('links')

                // <link rel="crop" type="x-im/crop" title="16:9" uri="im://crop/0.07865168539325842/0.0899/0.8426966292134831/0.9899" />
                for (var x in node.crops.crops) { // eslint-disable-line
                    let crop = node.crops.crops[x]
                    let uri = 'im://crop/' + crop.x + '/' + crop.y + '/' + crop.width + '/' + crop.height
                    cropLinks.append(
                        $$('link')
                            .attr({
                                rel: 'crop',
                                type: 'x-im/crop',
                                title: crop.name,
                                uri: uri
                            })
                    )
                }
                link.append(cropLinks)
            }

            el.append(
                $$('links').append(link)
            )
        }

    }
}

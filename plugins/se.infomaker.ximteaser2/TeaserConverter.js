import { idGenerator, api } from 'writer'

export default {

    type: 'ximteaser',
    tagName: 'object',

    matchElement: function (el, converter) {

        const {api} = converter.context
        const teaserTypes = api.getConfigValue('se.infomaker.ximteaser2', 'types')
        return teaserTypes.some(({type}) => {
            return type === el.attr('type')
        })

    },

    import: (el, node, converter) => {
        const {api} = converter.context

        const nodeId = el.attr('id')
        node.title = el.attr('title') ? el.attr('title') : ''
        node.dataType = el.attr('type')

        // Import teaser data
        const dataEl = el.find(':scope > data')
        if (dataEl) {
            dataEl.children.forEach(function (child) {
                if (child.tagName === 'text') {
                    node.text = converter.annotatedText(child, [node.id, 'text'])
                }

                if (child.tagName === 'subject') {
                    node.subject = converter.annotatedText(child, [node.id, 'subject'])
                }

            })

            const flagsEl = dataEl.find(':scope>flags')
            if (flagsEl) {
                flagsEl.children.forEach(childEl => {
                    if (childEl.text() === 'disableAutomaticCrop') {
                        node.disableAutomaticCrop = true
                    }
                })
            }
        }

        // Handle image link in teaser
        const linkEl = el.find('links > link')
        if (linkEl) {
            node.imageType = linkEl.attr('type')

            let imageFile = {
                id: idGenerator(),
                type: 'npfile',
                imType: 'x-im/image',
                parentNodeId: nodeId
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
                // this.importImageLinkData(linkDataEl, node)
            }
            else {
                // Old, depcrecated format, image data is found in teaser data
                // this.importImageLinkData(dataEl, node)
            }

            // Import softcrops if exists
            // this.importSoftcrops(linkEl, node)

            converter.createNode(imageFile)
            node.imageFile = imageFile.id
            node.uuid = linkEl.attr('uuid')
        }
    },


    export: (node, el, converter) => {
        const $$ = converter.$$

        el.removeAttr('data-id')
        el.attr({
            id: node.id,
            type: node.dataType
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

        if (node.disableAutomaticCrop) {
            data.append(
                $$('flags').append(
                    $$('flag').append('disableAutomaticCrop')
                )
            )
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
                let imageModule = api.getPluginModule('se.infomaker.ximimage.ximimagehandler')
                imageModule.exportSoftcropLinks($$, cropLinks, node.crops.crops)
                link.append(cropLinks)
            }

            el.append(
                $$('links').append(link)
            )
        }
    }
}
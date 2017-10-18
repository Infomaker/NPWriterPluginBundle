import { DefaultDOMElement } from 'substance'
import { idGenerator, api } from 'writer'

export default {

    type: 'ximteaser',
    tagName: 'object',

    matchElement: function (el) {
        const teaserTypes = api.getConfigValue('se.infomaker.ximteaser', 'types', [{ 'type': 'x-im/teaser' }])
        return teaserTypes.some(({type}) => type === el.attr('type'))
    },

    getConfigForType: function(dataType) {
        const teaserTypes = api.getConfigValue('se.infomaker.ximteaser', 'types', [])
        return teaserTypes.find(({type}) => type === dataType)
    },

    isMultilineEnabled: function(dataType) {
        const {fields} = this.getConfigForType(dataType)
        return fields.some(({id, multiline}) => id === 'text' && multiline === true)
    },

    import: function(el, node, converter) {
        const nodeId = el.attr('id')
        node.title = el.attr('title') ? el.attr('title') : ''
        node.dataType = el.attr('type')

        const multilineEnabled = this.isMultilineEnabled(node.dataType)

        // Import teaser data
        const dataEl = el.find(':scope > data')
        if (dataEl) {
            dataEl.children.forEach(function (child) {

                if (child.tagName === 'text') {
                    if(multilineEnabled) {
                        if(child.getAttribute('format') === 'idf') {
                            child.children.forEach((child) => {
                                const childNode = converter.convertElement(child)
                                node.nodes.push(childNode.id)
                            })
                        } else {
                            const {createElement} = DefaultDOMElement

                            const id = converter.nextId('paragraph')

                            // <element id="paragraph-804568bd037ce1042520dbdd2796fcc1" type="body">test</element>
                            const childTextNode = createElement('element').attr('id', id).attr('type', 'body').append(child.text())
                            console.log(childTextNode)
                            const childNode = converter.convertElement(childTextNode)

                            node.nodes.push(childNode.id)
                        }
                    } else {
                        if(child.getAttribute('format') === 'idf') {
                            const childText = child
                            childText.setInnerHTML(child.getTextContent())

                            node.text = converter.annotatedText(childText, [node.id, 'text'])
                        } else {
                            node.text = converter.annotatedText(child, [node.id, 'text'])
                        }
                    }
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

    /**
     * Import the image link structure
     */
    importSoftcrops: function(el, node) {
        let imageModule = api.getPluginModule('se.infomaker.ximimage.ximimagehandler')
        let softcrops = imageModule.importSoftcropLinks(
            el.find('links')
        )

        if (softcrops.length) {
            node.crops = {
                crops: softcrops
            }
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

    export: function(node, el, converter) {
        const multilineEnabled = this.isMultilineEnabled(node.dataType)
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

        if (node.text || node.nodes.length > 0) {
            const text = $$('text')
            if(multilineEnabled) {
                text.attr('format', 'idf')
                text.append(
                    converter.convertContainer(node)
                )
            } else {
                data.append(
                    text.append(converter.annotatedText([node.id, 'text']))
                )
            }

            data.append(text)
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
import { DefaultDOMElement, uuid } from 'substance'
import { idGenerator, api } from 'writer'

export default {

    type: 'ximteaser',
    tagName: 'object',

    matchElement: function (el) {
        const teaserTypes = api.getConfigValue('se.infomaker.ximteaser', 'types', [{ 'type': 'x-im/teaser' }])
        return teaserTypes.some(({type}) => type === el.attr('type'))
    },

    import: function(el, node, converter) {
        const nodeId = el.attr('id')
        node.dataType = el.attr('type')

        if (el.find('uuid')) {
            node.uuid = el.attr('uuid')
        }

        const dataEl = el.find(':scope > data')
        if (dataEl) {
            dataEl.children.forEach((child) => {
                // child.tagName will return the tag name in lowercase.
                // child.el.tagName, however, will return the tag name with the original capitalization.
                const tagName = child.el.tagName

                if(tagName === 'title') {
                    node.title = converter.annotatedText(child, [node.id, 'title'])
                } else if (tagName === 'subject') {
                    node.subject = converter.annotatedText(child, [node.id, 'subject'])
                } else if (tagName !== 'flags' && tagName !== 'text') {
                    this.importCustomFields(child, node, converter)
                }
            })

            const textEl = dataEl.find(':scope>text')
            if(textEl) {
                // Imports simple text or multiline text nodes
                this.importText(textEl, node, converter)
            } else {
                const emptyTextEl = DefaultDOMElement.createElement('text').append('')
                this.importText(emptyTextEl, node, converter)
            }

            const flagsEl = dataEl.find(':scope>flags')
            if (flagsEl) {
                flagsEl.children.forEach(childEl => {
                    if (childEl.text() === 'disableAutomaticCrop') {
                        node.disableAutomaticCrop = true
                    }
                })
            }
        }

        // If title was not set by <title> element, look for title attribute
        if(!node.title) {
            node.title = el.attr('title') ? el.attr('title') : ''
        }

        // Handle related article links in teaser
        if(this.isRelatedArticlesEnabled(node.dataType)) {
            const relatedArticleLinksElems = el.findAll('links > link[type="x-im/article"]')
            const relatedArticles = []
            relatedArticleLinksElems.forEach(relatedArticleElem => {
                relatedArticles.push({
                    title: relatedArticleElem.attr('title'),
                    uuid: relatedArticleElem.attr('uuid')
                })
            })
            node.relatedArticles = relatedArticles
        }

        // Handle image link in teaser
        const linkEl = el.find('links > link[rel="image"]')
        if (linkEl) {
            node.imageType = linkEl.attr('type')
            node.imageUuid = linkEl.attr('imageUuid')

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
            } else {
                // Old, depcrecated format, image data is found in teaser data
                this.importImageLinkData(dataEl, node)
            }

            // Import softcrops if exists
            node.crops = this.importCrops(linkEl.find('links'))

            converter.createNode(imageFile)
            node.imageFile = imageFile.id
        }
    },

    importCrops: function(imageLinks) {
        // Import softcrops
        const softcropTools = api.getPluginModule('se.infomaker.image-tools.softcrop')
        const crops = softcropTools.importSoftcropLinks(imageLinks)
        if (crops.length) {
            // Convert properties back to numbers
            return {
                crops: crops.map(softCrop => {
                    Object.keys(softCrop)
                        .filter(key => key !== 'name')
                        .forEach((key) => {
                            softCrop[key] = parseFloat(softCrop[key])
                        })
                    return softCrop
                })
            }
        } else {
            return {}
        }
    },

    getConfigForType: function(dataType) {
        const teaserTypes = api.getConfigValue('se.infomaker.ximteaser', 'types', [])
        return teaserTypes.find(({type}) => type === dataType)
    },

    isMultilineEnabled: function(dataType) {
        const {fields} = this.getConfigForType(dataType)
        return fields.some(({id, multiline}) => id === 'text' && multiline === true)
    },

    isRelatedArticlesEnabled: function(dataType) {
        const {enableRelatedArticles} = this.getConfigForType(dataType)
        return enableRelatedArticles === true
    },

    /**
     * Import contents of <text>-element. If multiline is configured, sets TeaserNode.nodes
     * else sets simple value to TeaserNode.text.
     *
     * @param {ui/DOMElement} textEl
     * @param {TeaserNode} node
     * @param {NewsMLImporter} converter
     */
    importText: function(textEl, node, converter) {
        if(this.isMultilineEnabled(node.dataType)) {
            this.importMultilineText(textEl, node, converter)
        } else {
            this.importSimpleText(textEl, node, converter)
        }
    },

    /**
     * Fills TeaserNode.nodes with stored <element>-elements contained in <text>-element.
     * If <text> only contains simple text, creates a new <element>-element and pushes
     * it to TeaserNode.nodes to enable multiline editing.
     *
     * @param {ui/DOMElement} textEl
     * @param {TeaserNode} node
     * @param {NewsMLImporter} converter
     */
    importMultilineText: function(textEl, node, converter) {
        if(textEl.getAttribute('format') === 'idf') {
            // Multiline enabled, text stored as multiline
            textEl.children.forEach((child) => {
                const childNode = converter.convertElement(child)
                node.nodes.push(childNode.id)
            })
        } else {
            // Multiline enabled, text stored as simple text, new paragraph node needs to be injected
            const {createElement} = DefaultDOMElement
            const paragraphTextNode = createElement('element').attr('type', 'body').append(textEl.text())
            const paragraphNode = converter.convertElement(paragraphTextNode)
            paragraphNode.id = uuid('paragraph')
            node.nodes.push(paragraphNode.id)
        }
    },

    /**
     * Sets string-value to TeaserNode.text-property.
     * If <text> is stored as multiline, it flattens the content
     * and fetches the simple text content from all children.
     *
     * @param textEl
     * @param node
     * @param converter
     */
    importSimpleText: function(textEl, node, converter) {
        if(textEl.getAttribute('format') === 'idf') {
            // Text stored as paragraph elements, return annotated text string
            const textContent = textEl.children.map((child) => child.getInnerHTML()).join(' ')
            textEl.setInnerHTML(textContent)

            node.text = converter.annotatedText(textEl, [node.id, 'text'])
        } else {
            // Normal behavior, stored and return as simple text
            node.text = converter.annotatedText(textEl, [node.id, 'text'])
        }
    },

    /**
     * Import contents of <customFields>-element.
     * Custom fields go in TeaserNode.customFields.<field name>
     *
     * @param {ui/DOMElement} customFieldEl
     * @param {TeaserNode} node
     * @param {NewsMLImporter} converter
     */
    importCustomFields: function(customFieldEl, node, converter) {
        // child.tagName will return the tag name in lowercase.
        // child.el.tagName, however, will return the tag name with the original capitalization.
        const tagName = customFieldEl.el.tagName
        node.customFields[tagName] = converter.annotatedText(customFieldEl, [node.id, 'customFields', tagName])
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
        const $$ = converter.$$

        el.removeAttr('data-id')
        el.attr({
            id: node.id,
            type: node.dataType
        })

        if(node.uuid) {
            el.attr({
                uuid: node.uuid
            })
        }

        // Data element
        const data = $$('data')

        if(node.title) {
            data.append(
                $$('title').append(converter.annotatedText([node.id, 'title']))
            )
            const simpleText = converter.getDocument().get([node.id, 'title'])
            el.attr('title', simpleText)
        }

        if (node.text || node.nodes.length > 0) {
            const text = this.exportText($$, node, converter)
            data.append(text)
        }

        if (node.subject) {
            data.append($$('subject').append(
                converter.annotatedText([node.id, 'subject'])
            ))
        }

        if (node.customFields) {
            const customFields = Object.keys(node.customFields)
                .filter(key => node.customFields[key])
                .map(key => {
                    return $$(key).append(
                        converter.annotatedText([node.id, 'customFields', key])
                    )
                })

            data.append(customFields)
        }

        if (node.disableAutomaticCrop) {
            data.append(
                $$('flags').append(
                    $$('flag').append('disableAutomaticCrop')
                )
            )
        }

        el.append(data)

        const links = this.exportLinks($$, node)
        el.append(links)

    },
    /**
     * The links element contains both the teasers image and related articles
     *
     * @param $$
     * @param {TeaserNode} node
     * @returns {VirtualElement}
     */
    exportLinks: function($$, node) {
        // Links
        let imageLink = null
        let fileNode = node.document.get(node.imageFile)
        if (fileNode && fileNode.uuid !== '' && node.uri) {
            imageLink = $$('link').attr({
                rel: 'image',
                type: 'x-im/image',
                uri: node.uri,
                uuid: fileNode.uuid
            })
            const linkData = $$('data')

            // Add image data and crops to data
            if(node.width) {
                linkData.append($$('width').append(String(node.width)))
            }

            if(node.height) {
                linkData.append($$('height').append(String(node.height)))
            }

            imageLink.append(linkData)

            if (node.crops && Array.isArray(node.crops.crops)) {
                const softcropTools = api.getPluginModule('se.infomaker.image-tools.softcrop')
                const cropLinks = $$('links').append(
                    softcropTools.exportSoftcropLinks($$, node.crops.crops)
                )
                imageLink.append(cropLinks)
            }
        }

        let relatedArticleLinks = null
        if (this.isRelatedArticlesEnabled(node.dataType) && node.relatedArticles && node.relatedArticles.length) {
            relatedArticleLinks = node.relatedArticles.map(article => {
                return $$('link').attr({
                    rel: 'article',
                    type: 'x-im/article',
                    title: article.title,
                    uuid: article.uuid
                })
            })
        }

        if (relatedArticleLinks || imageLink) {
            const linksElem = $$('links')

            if (imageLink) {
                linksElem.append(imageLink)
            }

            if (relatedArticleLinks) {
                linksElem.append(relatedArticleLinks)
            }

            return linksElem
        } else {
            return ''
        }
    },

    /**
     * Text is either stored as simple text in the TeaserNode.text-property
     * or as text-nodes in the TeaserNode.nodes-property, depending on configured
     * multiline value.
     *
     * @param $$
     * @param {TeaserNode} node
     * @param {NewsMLExporter} converter
     * @returns {VirtualElement}
     */
    exportText: function($$, node, converter) {
        const text = $$('text')

        if(this.isMultilineEnabled(node.dataType)) {
            text.attr('format', 'idf')
            text.append(
                converter.convertContainer(node)
            )
        } else {
            text.append(converter.annotatedText([node.id, 'text']))
        }

        return text
    }
}

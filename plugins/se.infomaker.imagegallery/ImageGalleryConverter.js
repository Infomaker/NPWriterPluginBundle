import {idGenerator, NilUUID, api} from 'writer'
import ImageGalleryNode from './ImageGalleryNode'

const ImageGalleryConverter = {
    type: ImageGalleryNode.type,
    tagName: 'object',
    dataType: 'x-im/imagegallery',

    matchElement(el) {
        return (el.is(`${this.tagName}`) && el.attr('type') === this.dataType)
    },

    /**
     * Newsml to Substance node
     *
     * @param {any} el
     * @param {any} node
     * @param converter
     */
    import(el, node, converter) {
        const galleryDataEl = el.find(':scope > data')
        const linksEl = el.find(':scope > links')
        const nodeId = el.attr('id')

        node.dataType = el.attr('type')
        node.id = nodeId

        if (galleryDataEl) {
            galleryDataEl.children.forEach(child => {
                if (child.tagName === 'text') {
                    node.genericCaption = converter.annotatedText(child, [node.id, 'genericCaption'])
                }
            })
        }

        if (linksEl) {
            linksEl.children.forEach(child => {
                const imgData = child.find(':scope > data')
                const imageId = idGenerator()
                const imageFile = {
                    id: imageId,
                    type: 'npfile',
                    imType: 'x-im/image',
                    parentNodeId: nodeId,
                    uuid: child.attr('uuid'),
                    uri: child.attr('uri')
                }
                const imageGalleryImage = {
                    type: 'imagegalleryimage',
                    parentNodeId: nodeId,
                    imageFile: imageFile.id
                }

                // Import author links
                imageGalleryImage.authors = []
                let imageLinks
                imageLinks = child.find('links')

                if (imageLinks) {
                    imageGalleryImage.authors = this.convertAuthors(node, imageLinks)

                    // Import softcrops
                    let imageModule = api.getPluginModule('se.infomaker.ximimage.ximimagehandler')
                    let softCrops = imageModule.importSoftcropLinks(imageLinks)
                    if (softCrops.length) {
                        // Convert properties back to numbers
                        softCrops = softCrops.map(softCrop => {
                            if (softCrop.x) softCrop.x = parseFloat(softCrop.x)
                            if (softCrop.y) softCrop.y = parseFloat(softCrop.y)
                            if (softCrop.width) softCrop.width = parseFloat(softCrop.width)
                            if (softCrop.height) softCrop.height = parseFloat(softCrop.height)
                            return softCrop
                        })

                        imageGalleryImage.crops = {
                            crops: softCrops
                        }
                    }
                }

                converter.createNode(imageFile)
                converter.createNode(imageGalleryImage)

                if (imgData) {
                    imgData.children.forEach(child => {
                        if (child.tagName === 'byline') {
                            imageGalleryImage.byline = converter.annotatedText(child, [imageGalleryImage.id, 'byline'])
                        }
                        if (child.tagName === 'text') {
                            imageGalleryImage.caption = converter.annotatedText(child, [imageGalleryImage.id, 'caption'])
                        }
                        if (child.tagName === 'height') {
                            imageGalleryImage.height = parseInt(child.text(), 10)
                        }
                        if (child.tagName === 'width') {
                            imageGalleryImage.width = parseInt(child.text(), 10)
                        }
                    })
                }

                node.nodes.push(imageGalleryImage.id)
            })
        }
    },

    convertAuthors: function(node, authorLinks) {
        let seen = new Map()

        return authorLinks.children
            .filter((authorLinkEl) => authorLinkEl.getAttribute('rel') === 'author')
            .map(function(authorLinkEl) {
                const emailElement = authorLinkEl.find('email')
                const uuid = authorLinkEl.getAttribute('uuid')
                return {
                    nodeId: node.id,
                    uuid,
                    name: authorLinkEl.getAttribute('title'),
                    email: emailElement ? emailElement.textContent : null,
                    isSimpleAuthor: NilUUID.isNilUUID(uuid) ? true : false,
                    isLoaded: false
                }
            })
            .filter((author) => {
                if(author.isSimpleAuthor) {
                    return true
                }
                if (seen.get(author.uuid) !== undefined) {
                    return false
                } else {
                    seen.set(author.uuid, author)
                    return true
                }
            })
    },

    /**
     * Substance node to Newsml
     *
     * @param {any} node
     * @param {any} el
     * @param {any} converter
     */
    export(node, el, converter) {
        const galleryImageNodes = node.nodes || []
        const {$$} = converter
        const data = $$('data')
        const links = $$('links')

        el.attr({
            'id': node.id,
            'type': node.dataType,
        })

        if (node.genericCaption && node.genericCaption.length) {
            data.append($$('text').append(
                converter.annotatedText([node.id, 'genericCaption'])
            ))
            el.append(data)
        }

        galleryImageNodes.forEach((galleryImageNodeId) => {
            const galleryImageNode = node.document.get(galleryImageNodeId)
            const galleryImage = node.document.get(galleryImageNode.imageFile)
            const imageData = $$('data')
            const link = $$('link').attr({
                rel: 'image',
                type: 'x-im/image',
                uri: galleryImage.uri,
                uuid: galleryImage.uuid
            })
            if (galleryImageNode.byline) {
                imageData.append($$('byline').append(
                    converter.annotatedText([galleryImageNode.id, 'byline'])
                ))
            }
            if (galleryImageNode.caption) {
                imageData.append($$('text').append(
                    converter.annotatedText([galleryImageNode.id, 'caption'])
                ))
            }
            if(galleryImageNode.height) {
                imageData.append(
                    $$('height').append(String(galleryImageNode.height))
                )
            }
            if(galleryImageNode.width) {
                imageData.append(
                    $$('width').append(String(galleryImageNode.width))
                )
            }

            link.append(imageData)

            const imageLinks = $$('links')

            // Add crops to data
            if (galleryImageNode.crops) {
                const imageModule = api.getPluginModule('se.infomaker.ximimage.ximimagehandler')
                imageModule.exportSoftcropLinks($$, imageLinks, galleryImageNode.crops.crops)
            }

            if (galleryImageNode.authors.length) {
                const authorLinks = galleryImageNode.authors.map((author) => {
                    const authorLink = $$('link').attr({
                        rel: 'author',
                        uuid: author.uuid,
                        title: author.name,
                        type: 'x-im/author'
                    })

                    if(author.email) {
                        const data = $$('data')
                        const email = $$('email').append(author.email)
                        data.append(email)
                        authorLink.append(data)
                    }
                    return authorLink
                })
                imageLinks.append(authorLinks)
            }

            if (imageLinks.children.length > 0) {
                link.append(imageLinks)
            }

            links.append(link)
        })

        el.append(links)
    }
}

export default ImageGalleryConverter

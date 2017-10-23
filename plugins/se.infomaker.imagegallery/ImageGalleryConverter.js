import {idGenerator} from 'writer'
import ImageGalleryNode from './ImageGalleryNode';

const ImageGalleryConverter = {
    type: ImageGalleryNode.type,
    tagName: 'object',
    dataType: 'x-im/imagegallery',

    matchElement(el) {
        return (el.is(`${this.tagName}`) && el.attr("type") === this.dataType)
    },

    /**
     * Newsml to Substance node
     * 
     * @param {any} el 
     * @param {any} node 
     */
    import(el, node, converter) {
        const galleryDataEl = el.find(':scope > data')
        const linksEl = el.find(':scope > links')

        node.imageFiles = Array.isArray(node.imageFiles) ? node.imageFiles : []
        node.dataType = el.attr('type')
        node.id = el.attr('id')

        if (galleryDataEl) {
            galleryDataEl.children.forEach(child => {
                if (child.tagName === 'caption') {
                    node.genericCaption = converter.annotatedText(child, 'caption')
                }
            })
        }

        if (linksEl) {
            linksEl.children.forEach(child => {
                const imgData = child.find(':scope > data')
                let imageId = idGenerator()
                let imageFile = {
                    id: imageId,
                    type: 'npfile',
                    imType: 'x-im/image',
                    parentNodeId: node.id,
                    uuid: child.attr('uuid'),
                    uri: child.attr('uri'),
                }
                let imageGalleryImage = {
                    id: `${imageId}-galleryImage`,
                    type: 'imagegalleryimage',
                    parentNodeId: node.id,
                }

                if (imgData) {
                    imgData.children.forEach(child => {
                        if (child.tagName === 'byline' || child.tagName === 'caption') {
                            imageGalleryImage[child.tagName] = converter.annotatedText(child, child.tagName)
                        }
                    })
                }

                converter.createNode(imageFile)
                converter.createNode(imageGalleryImage)

                node.imageFiles.push(imageFile.id)
                node.nodes.push(imageGalleryImage.id)
            })
        }
    },

    /**
     * Substance node to Newsml
     * 
     * @param {any} node 
     * @param {any} el 
     * @param {any} converter 
     */
    export(node, el, converter) {
        const imageFiles = node.imageFiles || []
        const {$$} = converter
        const data = $$('data')
        const links = $$('links')
        
        el.attr({
            'id': node.id,
            'type': node.dataType,
        })

        if (node.genericCaption && node.genericCaption.length) {
            data.append($$('caption').append(
                converter.annotatedText([node.id, 'genericCaption'])
            ))
            el.append(data)
        }

        imageFiles.forEach((imageFile) => {
            let fileNode = node.document.get(imageFile)
            let galleryImage = node.document.get(`${imageFile}-galleryImage`)
            let linkData = $$('data')
            let link = $$('link').attr({
                rel: 'image',
                type: 'x-im/image',
                uri: fileNode.uri,
                uuid: fileNode.uuid
            })
            if (galleryImage.byline) {
                linkData.append($$('byline').append(
                    converter.annotatedText([galleryImage.id, 'byline'])
                ))
            }
            if (galleryImage.caption) {
                linkData.append($$('caption').append(
                    converter.annotatedText([galleryImage.id, 'caption'])
                ))
            }
            link.append(linkData)
            links.append(link)
        })

        el.append(links)
    }
}

export default ImageGalleryConverter
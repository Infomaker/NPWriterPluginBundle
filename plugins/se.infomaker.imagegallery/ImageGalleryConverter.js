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
                let imageFile = {
                    id: idGenerator(),
                    type: 'npfile',
                    imType: 'x-im/image',
                    parentNodeId: node.id,
                    uuid: child.attr('uuid'),
                    uri: child.attr('uri'),
                }
                converter.createNode(imageFile)
                node.imageFiles.push(imageFile.id)
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
            let link = $$('link').attr({
                rel: 'image',
                type: 'x-im/image',
                uri: fileNode.uri,
                uuid: fileNode.uuid
            })
            links.append(link)
        })

        el.append(links)
    }
}

export default ImageGalleryConverter
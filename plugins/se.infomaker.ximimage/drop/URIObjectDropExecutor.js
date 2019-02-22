import {api, idGenerator} from 'writer'
import PropertyMap from '../models/PropertyMap'

/** NOTES


var nodeId = writer.api.document.nodes()[2].id

writer.api.editorSession.transaction(tx => {
    const container = tx.get('body')
    console.log(container.getPosition(nodeId))
    tx.update(
        container.getContentPath,
        {
            delete: {
                offset: container.getPosition(nodeId)
            }
        }
    )

    tx.delete(nodeId)
})

writer.api.editorSession.transaction(tx => {
    tx.delete('paragraph-112d3e60bce9138ee8af868c4f2ccd30')
})


x-im-object://x-im/image?data={
    source: {
        url: 'https://egyptianstreets.com/wp-content/uploads/2015/08/246596.jpg',
        name: 'egyptianstreets.com',
        id: '2015/08/246596.jpg'
    },
    data: {
        caption: 'ufi whirling dervishes performing at Beit Sanqar al-Saady in Cairo'
    }
}

x-im-object://x-im/image?data={"source": {"url": "https://egyptianstreets.com/wp-content/uploads/2015/08/246596.jpg","name": "egyptianstreets.com","id": "2015/08/246596.jpg"},"data": {"caption": "Sufi whirling dervishes performing at Beit Sanqar al-Saady in Cairo"}}


x-im-object://x-im/image?data="%7B%22source%22%3A%20%7B%22url%22%3A%20%22https%3A%2F%2Fegyptianstreets.com%2Fwp-content%2Fuploads%2F2015%2F08%2F246596.jpg%22%2C%22name%22%3A%20%22egyptianstreets.com%22%2C%22id%22%3A%20%222015%2F08%2F246596.jpg%22%7D%2C%22data%22%3A%20%7B%22caption%22%3A%20%22Sufi%20whirling%20dervishes%20performing%20at%20Beit%20Sanqar%20al-Saady%20in%20Cairo%22%7D"

*/

/**
 * DropExecutor inserts an image correctly
 */
class URIObjectDropExecutor {
    insert(tx, uriObject, last) {
        const fileObject = {
            parentNodeId: idGenerator(),
            type: 'npfile',
            imType: 'x-im/image',
            sourceUrl: uriObject.source.rawUrl
        }

        const fileNode = tx.create(fileObject)
        const propertyMap = PropertyMap.getValidMap()

        const obj = {
            id: fileObject.parentNodeId,
            type: 'ximimage',
            imageFile: fileNode.id,
            caption: propertyMap.caption !== false ? uriObject.data[propertyMap.caption] || '' : '',
            alttext: propertyMap.alttext !== false ? uriObject.data[propertyMap.alttext] || '' : '',
            credit: propertyMap.credit !== false ? uriObject.data[propertyMap.credit] || '': '',
            alignment: ''
        }

        if (uriObject.source) {
            obj.source = {}
            obj.source.uri = uriObject.source.uri || ''
            obj.source.type = uriObject.source.type || ''
        }

        tx.insertBlockNode(obj)

        setImmediate(() => {
            const doc = api.editorSession.getDocument()

            api.editorSession.fileManager.sync()
                .then(() => {
                    const imageNode = doc.get(fileObject.parentNodeId)
                    imageNode.emit('onImageUploaded')
                })
                .catch((ex) => {
                    console.error(ex.message)

                    const imageNode = doc.get(fileObject.parentNodeId)
                    const fileNode = imageNode.imageFile

                    if (fileNode) {
                        api.editorSession.transaction(tx => {
                            tx.delete(fileNode)
                        })
                    }

                    api.document.deleteNode('ximimage', imageNode)
                })
        })
    }


    /**
     * Extract the type of type of the object uri, eg x-im/image from the example uri
     *
     * @example
     * x-im-object://x-im/image?data=%7B%22source%22%3A%20%7B%22uri%22%3A%20%22https%3A%2F%2Finfomaker.io%2Fpublic%2Fuploads%2F2015%2F08%2F246596.jpg%22%2C%22type%22%3A%20%22infomaker.io%22%2C%22id%22%3A%20%222015%2F08%2F246596.jpg%22%7D%2C%22data%22%3A%20%7B%22caption%22%3A%20%22Sufi%20whirling%20dervishes%20performing%20at%20Beit%20Sanqar%20al-Saady%20in%20Cairo%22%7D%7D
     *
     * @param {string} uri
     */
    parseDropURIType(uri) {
        const type = /x-im-object:\/\/([^?]+)/.exec(uri)

        return (type.length === 2) ? type[1] : null
        // if (params.uri && params.uri.indexOf(`x-im-object://${this.matchType}`) === 0) {
        //     return true
        // }
    }

    /**
     * Parse an object uri into a a simple object, example uri and object
     *
     * @example
     * x-im-object://x-im/image?data=%7B%22source%22%3A%20%7B%22uri%22%3A%20%22https%3A%2F%2Finfomaker.io%2Fpublic%2Fuploads%2F2015%2F08%2F246596.jpg%22%2C%22type%22%3A%20%22infomaker.io%22%2C%22id%22%3A%20%222015%2F08%2F246596.jpg%22%7D%2C%22data%22%3A%20%7B%22caption%22%3A%20%22Sufi%20whirling%20dervishes%20performing%20at%20Beit%20Sanqar%20al-Saady%20in%20Cairo%22%7D%7D
     *
     * @example
     * x-im-object://x-im/image?data={
     *     type: "x-im/image",
     *     source: {
     *         url: "https://infomaker.io/public/uploads/2015/08/246596.jpg",
     *         uri: "x-im-oc-image://246596",
     *         type: "x-im-oc-image",
     *         title: "Infomaker System"
     *     },
     *     data: {
     *         caption: "ufi whirling dervishes performing at Beit Sanqar al-Saady in Cairo"
     *     }
     * }
     *
     * @param {string} uri
     * @return {object}
     */
    parseDropURI(uri) {
        let obj

        try {

            const key = 'data='
            const pos = uri.indexOf(key)

            obj = JSON.parse(
                decodeURIComponent(
                    uri.substr(pos + key.length, uri.length)
                )
            )
            obj.type = this.parseDropURIType(uri)
        }
        catch (ex) {
            console.warn(`Dropped x-im-object uri invalid: ${uri}`)
            obj = null
        }

        return obj
    }
}

export { URIObjectDropExecutor }

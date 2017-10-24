import {idGenerator, api} from 'writer'

/*
    Insert an image via file or uri.

    data either contains a File object or a url. NPImageProxy detects if
    data is a file or uri and calls the appropriate sync(=upload) method.
*/


export default function(tx, data) {
    let isFile = data instanceof File,
        nodeId = idGenerator()

    const isImage = api.getPluginModule('se.infomaker.ximimage.isImage')


    if (!typeof data === 'string' && !isFile) {
        throw new Error('Unsupported data. Must be File or String')
    }

    let name = isFile ? data.name : data
    if (!isImage(name)) {
        throw new Error('Unsupported image format')
    }

    const imageFileNode = {
        parentNodeId: nodeId,
        type: 'npfile',
        imType: 'x-im/image'
    }

    if(isFile) {
        imageFileNode['sourceFile'] = data
    } else if(typeof data === 'string') {
        imageFileNode['sourceUrl'] = data
    }

    // Create file node for the image
    let imageFile = tx.create(imageFileNode)

    // Inserts image at current cursor pos
    tx.insertBlockNode({
        id: nodeId,
        type: 'ximimage',
        imageFile: imageFile.id,
        caption: '',
        alttext: '',
        credit: '',
        alignment: '',
        width: 0,
        height: 0
    })

    return nodeId
}

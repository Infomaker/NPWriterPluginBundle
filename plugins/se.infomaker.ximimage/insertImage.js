import {idGenerator} from 'writer'

/*
    Insert an image via file or uri.

    data either contains a File object or a url. NPImageProxy detects if
    data is a file or uri and calls the appropriate sync(=upload) method.
*/


export default function(tx, data) {
    let isFile = data instanceof File,
        nodeId = idGenerator(),
        mimeType

    if (isFile) {
        mimeType = data.type
    }
    else if (typeof data === 'string') {
        let ext = data.split('.').pop()
        // Extract use file extension
        mimeType = 'image/' + ext
    }
    else {
        throw new Error('Unsupported data. Must be File or String')
    }

    // Create file node for the image
    let imageFile = tx.create({
        imageNodeId: nodeId,
        type: 'ximimagefile',
        fileType: 'image',
        mimeType: mimeType,
        sourceFile: isFile ? data: '',
        sourceUrl: !isFile ? data : ''
    })

    // Inserts image at current cursor pos
    tx.insertBlockNode({
        id: nodeId,
        type: 'ximimage',
        imageFile: imageFile.id,
        caption: '',
        alttext: '',
        credit: '',
        alignment: ''
    })
}

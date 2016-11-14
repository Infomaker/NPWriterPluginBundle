/*
    Insert an image via file or uri.

    data either contains a File object or a url. NPImageProxy detects if
    data is a file or uri and calls the appropriate sync(=upload) method.
*/
export default function(tx, data) {
    let isFile = data instanceof File
    let mimeType

    if (isFile) {
        mimeType = data.type
    } else if (typeof data === 'string') {
        let ext = data.split('.').pop()
        // Extract use file extension
        mimeType = 'image/'+ext
    } else {
        throw new Error('Unsupported data. Must be File or String')
    }

    // Create file node for the image
    let imageFile = tx.create({
        type: 'npfile',
        fileType: 'image',
        mimeType: mimeType,
        data: data, // either File object or uri
        caption: 'Enter caption here',
        // QUESTION Michael: why is this needed?
        knownData: isFile
    })

    // Inserts image at current cursor pos
    tx.insertBlockNode({
        type: 'ximimage',
        imageFile: imageFile.id
    })
}
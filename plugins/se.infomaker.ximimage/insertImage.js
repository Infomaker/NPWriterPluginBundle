/*
    Insert an image via file or uri.

    data either contains a File object or a url. NPImageProxy detects if
    data is a file or uri and calls the appropriate sync(=upload) method.
*/

export default function(tx, params) {
    let mimeType

    if (params.file) {
        mimeType = params.file.type
    } else if (params.sourceUrl) {
        let ext = params.sourceUrl.split('.').pop()
        // Extract use file extension
        mimeType = 'image/'+ext
    } else {
        throw new Error('Unsupported data. Must be File or String')
    }

    // Create file node for the image
    let imageFile = tx.create({
        type: 'ximimagefile',
        fileType: 'image',
        mimeType: mimeType,
        sourceUrl: params.sourceUrl,
        data: params.file,
        // QUESTION Michael: why is this needed?
        knownData: Boolean(params.file)
    })

    // Inserts image at current cursor pos
    tx.insertBlockNode({
        type: 'ximimage',
        caption: 'Enter caption here',
        imageFile: imageFile.id
    })
}
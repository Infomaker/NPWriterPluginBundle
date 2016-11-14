/*
    Insert an image via file or uri.

    data either contains a File object or a url. NPImageProxy detects if
    data is a file or uri and calls the appropriate sync(=upload) method.
*/
export default function(tx, data) {

    // Create file node for the image
    let imageFile = tx.create({
        type: 'npfile',
        fileType: 'image',
        mimeType: file.type,
        data: data, // either File object or uri
        caption: 'Enter caption here',
        // QUESTION Michael: why is this needed?
        knownData: Boolean(file)
    })

    // Inserts image at current cursor pos
    tx.insertNode({
        type: 'ximimage',
        imageFile: imageFile.id
    })
}
/*
 Insert a pdf via file or uri.

 // TODO: Need to implement a NPPdfProxy in NPWriter

 data either contains a File object or a url. NPPdfProxy detects if
 data is a file or uri and calls the appropriate sync(=upload) method.
 */
export default function (tx, data) {
    let isFile = data instanceof File
    let mimeType

    if (isFile || typeof data === 'string') {
        mimeType = 'application/pdf'
    } else {
        throw new Error('Unsupported data. Must be File or String')
    }

    // Create file node for the pdf
    let pdfFile = tx.create({
        type: 'ximpdffile',
        fileType: 'pdf',
        mimeType: mimeType,
        data: data, // either File object or uri
        text: 'Enter label here',
    })

    // Inserts image at current cursor pos
    tx.insertBlockNode({
        type: 'ximpdf',
        pdfFile: pdfFile.id
    })
}
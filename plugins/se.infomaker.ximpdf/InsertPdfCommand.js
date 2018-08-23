import {idGenerator} from 'writer'


/*
 Insert a pdf via file or uri.

 data either contains a File object or a url. NPPdfProxy detects if
 data is a file or uri and calls the appropriate sync(=upload) method.
 */
export default function (tx, data) {

    const parentNodeId = idGenerator()

    const pdfFileNode = {
        type: 'npfile',
        parentNodeId: parentNodeId,
        imType: 'x-im/pdf'
    }

    let isFile = data instanceof File

    if (isFile) {
        pdfFileNode['sourceFile'] = data
    }
    else if (typeof data === 'string') {
        pdfFileNode['sourceUrl'] = data
    }
    else {
        throw new Error('Unsupported data. Must be File or String')
    }

    let pdfFile = tx.create(pdfFileNode)

    // Inserts image at current cursor pos
    tx.insertBlockNode({
        id: parentNodeId,
        type: 'ximpdf',
        pdfFile: pdfFile.id
    })

    return parentNodeId
}

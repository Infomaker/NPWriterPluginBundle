import {BlockNode} from 'substance'
import {api} from 'writer'

class Ximpdf extends BlockNode {

    getPdfFile() {
        if (this.pdfFile) {
            return this.document.get(this.pdfFile)
        }
    }

    getUrl() {
        let pdfFile = this.getPdfFile()
        if (pdfFile) {
            return pdfFile.getUrl()
        }
    }

    handleDOMDocument(newsItemDOMDocument) {

        const document = newsItemDOMDocument.documentElement
        const uri = document.querySelector('itemMeta > itemMetaExtProperty[type="imext:uri"]').getAttribute('value')
        let text = document.querySelector('contentMeta > metadata > object[type="x-im/pdf"] > data > text')
        const objectName = document.querySelector('contentMeta > metadata > object[type="x-im/pdf"] > data > objectName')

        if (text) {
            text = text.textContent
        } else if (objectName) {
            text = objectName.textContent
        } else {
            // Filename should always exist
            text = document.querySelector('itemMeta > fileName').textContent
        }


        // Update PDFNode
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'uri'], uri)
            tx.set([this.id, 'text'], text)
        }, {history: false})


    }
}


Ximpdf.define({
    type: 'ximpdf',
    pdfFile: {type: 'file'},
    uri: {type: 'string', optional: true},
    text: {type: 'string', optional: true}
})

export default Ximpdf

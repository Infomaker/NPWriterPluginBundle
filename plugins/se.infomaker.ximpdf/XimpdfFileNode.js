import {FileNode} from 'substance'
import {api} from 'writer'

class XimpdfFileNode extends FileNode {

    constructor(...args) {
        super(...args)
    }

    handleDocument(xmlString) {
        return new Promise((resolve, reject) => {
            try {
                let doc = api.editorSession.getDocument()

                if (!doc.get(this.pdfNodeId)) {
                    // pdf file node may exists (in order to be able to undo/redo)
                    // but pdf node is not present, just resolve.
                    return resolve()
                }

                const parser = new DOMParser()

                let newsItemDOM = parser.parseFromString(xmlString, 'text/xml')
                let document = newsItemDOM.documentElement
                let uuid = document.getAttribute('guid')
                const uri = document.querySelector('itemMeta > itemMetaExtProperty[type="imext:uri"]').getAttribute('value')
                let text = document.querySelector('contentMeta > metadata > object[type="x-im/pdf"] > data > text')
                let objectName = document.querySelector('contentMeta > metadata > object[type="x-im/pdf"] > data > objectName')

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
                    tx.set([this.pdfNodeId, 'uri'], uri)
                    tx.set([this.pdfNodeId, 'text'], text)
                }, {history: false})

                // Update fileNode
                this.uuid = uuid

                resolve()
            }
            catch (e) {
                reject(e)
            }
        })
    }

    getImType() {
        return 'x-im/pdf'
    }
}

XimpdfFileNode.define({
    type: 'ximpdffile',
    pdfNodeId: {type: 'string', optional: false},
    uuid: {type: 'string', optional: true},
    url: {type: 'string', optional: true},
    sourceFile: {type: 'object', optional: true},
    sourceUrl: {type: 'string', optional: true}
})

export default XimpdfFileNode
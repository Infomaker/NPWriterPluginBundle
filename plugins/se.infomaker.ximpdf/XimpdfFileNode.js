import {FileNode} from 'substance'
import {api} from 'writer'

class XimpdfFileNode extends FileNode {

    constructor(...args) {
        super(...args)
    }

    handleDocument(xmlString) {
        return new Promise((resolve, reject) => {
            try {
                const parser = new DOMParser()

                let newsItemDOM = parser.parseFromString(xmlString, 'text/xml')
                let documentElement = newsItemDOM.documentElement
                let uuid = documentElement.getAttribute('guid')
                const uri = documentElement.querySelector('itemMeta > itemMetaExtProperty[type="imext:uri"]').getAttribute('value')
                let text = documentElement.querySelector('contentMeta > metadata > object[type="x-im/pdf"] > data > text')
                // TODO: Add error handling
                if (text) {
                    text = text.textContent
                } else {
                    text = documentElement.querySelector('contentMeta > metadata > object[type="x-im/pdf"] > data > objectName').textContent
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
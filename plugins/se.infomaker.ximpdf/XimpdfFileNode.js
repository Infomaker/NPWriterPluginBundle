import {FileNode} from 'substance'

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

                this.uuid = uuid
                this.uri = documentElement.querySelector('itemMeta > itemMetaExtProperty[type="imext:uri"]').getAttribute('value')
                this.text = documentElement.querySelector('contentMeta > metadata > object[type="x-im/pdf"] > data > text')

                // TODO: Add error handling
                if (this.text) {
                    this.text = this.text.textContent
                } else {
                    this.text = documentElement.querySelector('contentMeta > metadata > object[type="x-im/pdf"] > data > objectName').textContent
                }

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
    uuid: {type: 'string', optional: true},
    url: {type: 'string', optional: true},
    uri: {type: 'string', optional: true},
    data: {type: 'object|string', optional: true},
    text: {type: 'string', optional: true},
    objectName: {type: 'string', optional: true},
    previewUrl: {type: 'string', optional: true}
})

export default XimpdfFileNode
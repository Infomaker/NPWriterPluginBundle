import {BlockNode} from 'substance'
import {api} from 'writer'
class Ximteaser extends BlockNode {

    getImageFile() {
        if (this.imageFile) {
            return this.document.get(this.imageFile)
        }

    }

    getUrl() {
        let imageFile = this.getImageFile()
        if (imageFile) {
            return imageFile.getUrl()
        }
    }

    handleDOMDocument(newsItemDOMDocument) {
        const document = newsItemDOMDocument.documentElement
        const uri = document.querySelector('itemMeta > itemMetaExtProperty[type="imext:uri"]').getAttribute('value')

        // Update PDFNode
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'uri'], uri)
        }, {history: false})
    }
}

Ximteaser.define({
    type: 'ximteaser',
    dataType: {type: 'string', optional: false},
    imageFile: { type: 'file', optional: true },

    title: {type: 'string', optional: false, default: '' },
    subject: {type: 'string', optional: false, default: '' },
    text: {type: 'string', optional: false, default: '' },

    // ATTENTION: progress should not be part of the model
    // progress: {type: 'number', default: 100 },
    width: {type: 'number', optional: true },
    height: {type: 'number', optional: true },
    crops: { type: 'object', default: [] }
})

export default Ximteaser


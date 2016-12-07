const { BlockNode } = substance
import {api} from 'writer'

class Ximimage extends BlockNode {

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

    setAlignment(alignment) {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'alignment'], alignment)
        })
    }

    handleDOMDocument(newsItemDOMDocument) {

        //@TODO: Finish update the node
        const document = newsItemDOMDocument.documentElement
        const uri = document.querySelector('itemMeta > itemMetaExtProperty[type="imext:uri"]').getAttribute('value')

        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'uri'], uri)
        }, {history: false})

    }
}


Ximimage.define({
    type: 'ximimage',
    uuid: { type: 'string', optional: true},
    uri: { type: 'string', optional: true},
    imageFile: { type: 'file' },
    width: {type: 'number', optional: true},
    height: {type: 'number', optional: true},

    crops: {type: 'object', default: []},
    authors: { type: 'array', default: [] },

    // Semi configurable, optional, fields
    caption: { type: 'string', default: '' },
    alttext: { type: 'string', optional: true },
    credit: { type: 'string', optional: true },
    alignment: { type: 'string', optional: true }
})

export default Ximimage

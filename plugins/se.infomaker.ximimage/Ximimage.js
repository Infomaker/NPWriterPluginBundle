const { BlockNode } = substance

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
}


// Payload fetching will be managed by the resource manager
Ximimage.isResource = true

Ximimage.define({
    type: 'ximimage',

    // stores a blob/file object of the image, used only local but must survive undo/redo
    // must not be sent over the wire in realtime case (local: true)
    // imageFile: { type: 'blob', optional: true },
    // imageFile: { type: 'blob' },

    // Resource url (available after upload is completed)
    // url: { type: 'string', optional: true },

    knownData: { type: 'boolean', default: false },
    caption: { type: 'string', optional: true },
    alttext: { type: 'string', optional: true },
    credit: { type: 'string', optional: true },
    alignment: { type: 'string', optional: true },

    width: { type: 'number', optional: true },
    height: { type: 'number', optional: true },
    authors: { type: 'array', default: [] },
    crops: { type: 'object', default: [] }

    // progress: { type: 'number', default: 100 },
    // uuid: { type: 'string', optional: true },
    // uri: { type: 'string', optional: true },
})

export default Ximimage

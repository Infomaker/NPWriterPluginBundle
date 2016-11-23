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

    setAlignment(alignment) {
        this.document.set([this.id, 'alignment'], alignment);
    }
}


Ximimage.define({
    type: 'ximimage',
    uuid: { type: 'string', optional: true},
    imageFile: { type: 'file' },
    data: { type: 'string', optional: true},
    knownData: { type: 'boolean', default: false },

    // Configurable fields
    caption: { type: 'string', default: '' },
    alttext: { type: 'string', optional: true },
    credit: { type: 'string', optional: true },
    alignment: { type: 'string', optional: true },

    authors: { type: 'array', default: [] },
})

export default Ximimage

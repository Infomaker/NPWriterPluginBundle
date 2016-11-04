const { BlockNode } = substance

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
}

Ximteaser.define({
    type: 'ximteaser',
    dataType: {type: 'string', optional: false},
    imageFile: { type: 'file' },
    title: {type: 'string', optional: false, default: '' },
    subject: {type: 'string', optional: false, default: '' },
    text: {type: 'string', optional: false, default: '' },
    imageType: {type: 'string', optional: true },
    // ATTENTION: progress should not be part of the model
    // progress: {type: 'number', default: 100 },
    width: {type: 'number', optional: true },
    height: {type: 'number', optional: true },
    crops: { type: 'object', default: [] }
})

export default Ximteaser


const {BlockNode} = substance

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
}


Ximpdf.define({
    type: 'ximpdf',
    uuid: {type: 'string', optional: true},
    pdfFile: {type: 'file'},
    url: {type: 'string', optional: true},
    uri: {type: 'string', optional: true},
    text: {type: 'string', optional: true},
    data: { type: 'string', optional: true},
    objectName: {type: 'string', optional: true},
    previewUrl: {type: 'string', optional: true}
})

export default Ximpdf

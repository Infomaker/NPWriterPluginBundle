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
    pdfFile: {type: 'file'},
    uri: {type: 'string', optional: true},
    text: {type: 'string', optional: true}
})

export default Ximpdf

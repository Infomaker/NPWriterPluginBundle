import {api, withTraits, traitBundle, fetchImageMeta} from 'writer'
import {BlockNode} from 'substance'

const {imageNodeTrait, imageCropTrait, authorNodeTrait} = traitBundle

class Ximimage extends withTraits(BlockNode, imageNodeTrait, imageCropTrait, authorNodeTrait) {

    onImageUploaded() {
        const imageFile = this.getImageFile()
        if (imageFile) {
            // console.log(imageFile)
            console.log('fetching after upload')
            return fetchImageMeta(imageFile.uuid)
                .then((node) => {
                    api.editorSession.transaction((tx) => {
                        tx.set([this.id, 'uuid'], node.uuid)
                        tx.set([this.id, 'uri'], node.uri)
                        if (isUnset(this.caption)) {
                            tx.set([this.id, 'caption'], node.caption)
                        }
                        if (isUnset(this.credit)) {
                            tx.set([this.id, 'credit'], node.credit)
                        }
                        tx.set([this.id, 'width'], node.width)
                        tx.set([this.id, 'height'], node.height)
                        if (isUnset(this.authors)) {
                            tx.set([this.id, 'authors'], node.authors)
                        }
                    })
                })
        }
    }

    setAlignment(alignment) {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'alignment'], alignment)
        })
    }
}

function isUnset(field) {
    if (field === undefined || field === null) {
        return true
    }

    if (typeof field === 'string' && field.trim() === '') {
        return true
    }

    //noinspection RedundantIfStatementJS
    if (Array.isArray(field) && field.length === 0) {
        return true
    }

    return false
}

Ximimage.define({
    type: 'ximimage',
    uuid: {type: 'string', optional: true},
    uri: {type: 'string', optional: true},
    imageFile: {type: 'file'},
    width: {type: 'number', optional: true},
    height: {type: 'number', optional: true},
    disableAutomaticCrop: {type: 'boolean', optional: true, default: false},
    errorMessage: {type: 'string', optional: true},
    crops: {type: 'object', default: {}},
    authors: {type: 'array', default: []},

    // Semi configurable, optional, fields
    caption: {type: 'string', default: ''},
    alttext: {type: 'string', optional: true},
    credit: {type: 'string', optional: true},
    alignment: {type: 'string', optional: true}
})

export default Ximimage

import {api, withTraits, traitBundle, fetchImageMeta} from 'writer'
import {BlockNode} from 'substance'
import PropertyMap from './models/PropertyMap'

const {imageNodeTrait, imageCropTrait, authorNodeTrait} = traitBundle

class Ximimage extends withTraits(BlockNode, imageNodeTrait, imageCropTrait, authorNodeTrait) {

    onImageUploaded() {
        const imageFile = this.getImageFile()
        if (imageFile) {
            const mappedProps = PropertyMap.getValidMap()
            return fetchImageMeta(imageFile.uuid)
                .then((meta) => {
                    api.editorSession.transaction((tx) => {
                        tx.set([this.id, 'uuid'], meta.uuid)
                        tx.set([this.id, 'uri'], meta.uri)
                        tx.set([this.id, 'width'], meta.width)
                        tx.set([this.id, 'height'], meta.height)
                        if (isUnset(this.caption) && mappedProps.caption !== false) {
                            tx.set([this.id, 'caption'], meta[mappedProps.caption])
                        }
                        if (isUnset(this.credit) && mappedProps.credit !== false) {
                            tx.set([this.id, 'credit'], meta[mappedProps.credit])
                        }
                        if (isUnset(this.authors) && mappedProps.authors !== false) {
                            tx.set([this.id, 'authors'], meta.authors)
                        }
                        if (isUnset(this.alttext) && mappedProps.alttext !== false) {
                            tx.set([this.id, 'alttext'], meta[mappedProps.alttext])
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
    uri: {type: 'string', optional: true, default: 'im://temp'},
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

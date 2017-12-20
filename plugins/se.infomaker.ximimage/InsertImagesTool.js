import {Tool} from 'substance'
import {api} from 'writer'
import {getMIMETypes} from './models/ImageTypes'
import insertImage from './models/insertImage'

class XimimageTool extends Tool {

    render($$) {
        const el = $$('div')
        el.attr('title', this.getLabel('Upload image'))

        el.append(
            $$('button').addClass('se-tool').append(
                $$('i').addClass('fa fa-image')
            ).on('click', this.triggerFileDialog)
        )

        el.append(
            $$('input')
                .attr('type', 'file')
                .attr('multiple', 'multiple')
                .attr('id', 'x-im-image-fileupload')
                .attr('accept', getMIMETypes().join(','))
                .ref('x-im-image-fileupload')
                .on('change', this.triggerFileUpload)
        )

        return el
    }

    triggerFileDialog() {
        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click', true, false)
        this.refs['x-im-image-fileupload'].el.el.dispatchEvent(evt)
    }

    triggerFileUpload(ev) {
        const nodeId = this.insertImage(ev.target.files[0])
        api.editorSession.fileManager.sync()
            .then(() => {
                const imageNode = api.editorSession.getDocument().get(nodeId)
                imageNode.emit('onImageUploaded')
            })
            .catch(() => {
                return this.onUploadFailure(nodeId)
            })
    }

    insertImage(file) {
        let insertRes = null
        try {
            api.editorSession.transaction(tx => {
                insertRes = insertImage(tx, file)
            })
            return insertRes
        } catch (err) {
            return this.onUploadFailure(insertRes)
        }
    }

    onUploadFailure(nodeId) {
        // If the image upload fails it is probably because it is an unsupported format,
        // but because we are not sure, we use the generic image upload error message
        api.ui.showNotification('ximimage', api.getLabel('image-error-title'), api.getLabel('image-upload-error-message'))
        this.removeNode(nodeId)
    }

    removeNode(nodeId) {
        try {
            const doc = api.editorSession.getDocument()
            const node = doc.get(nodeId)

            api.document.deleteNode('ximimage', node)

            const imageFile = node.imageFile
            if (imageFile) {
                api.editorSession.transaction((tx) => {
                    tx.delete(imageFile)
                })
            }
        }
        catch (err) {
            console.error(err)
        }
    }
}

export default XimimageTool

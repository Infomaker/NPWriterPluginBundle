import {Tool} from 'substance'
import {api} from 'writer'
import * as ImageTypes from './models/ImageTypes'
import insertImage from "./models/insertImage"

class XimimageTool extends Tool {

    render($$) {
        var el = $$('div')
        el.attr('title', this.getLabel('Upload image'))

        el.append(
            $$('button').addClass('se-tool').append(
                $$('i').addClass('fa fa-image')
            ).on('click', this.triggerFileDialog)
        );

        el.append(
            $$('input')
                .attr('type', 'file')
                .attr('multiple', 'multiple')
                .attr('id', 'x-im-image-fileupload')
                .attr('accept', ImageTypes.getMIMETypes().join(','))
                .ref('x-im-image-fileupload')
                .on('change', this.triggerFileUpload)
        );

        return el;
    }

    triggerFileDialog() {
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, false);
        this.refs['x-im-image-fileupload'].el.el.dispatchEvent(evt);
    }

    triggerFileUpload(ev) {
        let nodeId

        try {
            api.editorSession.transaction(tx => {
                nodeId = insertImage(tx, ev.target.files[0])
            })
        } catch (err) {
            return this.onUploadFailure(nodeId)
        }

        api.editorSession.fileManager.sync().catch(err => {
            return this.onUploadFailure(nodeId)
        })
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
        catch(err) {
            console.error(err)
        }
    }
}

export default XimimageTool

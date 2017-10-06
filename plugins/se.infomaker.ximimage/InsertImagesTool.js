import {Tool} from 'substance'
import {api} from 'writer'

class XimimageTool extends Tool {

    render($$) {
        var el = $$('div')
        el.attr('title', this.getLabel('Upload image'))

        el.append(
            $$('button').addClass('se-tool').append(
                $$('i').addClass('fa fa-image')
            )
                .on('click', this.triggerFileDialog)
        );

        el.append(
            $$('input')
                .attr('type', 'file')
                .attr('multiple', 'multiple')
                .attr('id', 'x-im-image-fileupload')
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
        try {
            this.context.editorSession.executeCommand('insert-images', {
                files: ev.target.files
            })
        } catch (err) {
            api.ui.showNotification('ximimage', api.getLabel('Error'), api.getLabel(err.message))
        }
    }
}

export default XimimageTool

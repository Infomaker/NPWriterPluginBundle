import {Tool} from 'substance'

class XimimageTool extends Tool {

    render($$) {
        var el = $$('div')

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
        this.context.editorSession.executeCommand('insert-ximimage', {
            files: ev.target.files
        })
    }
}

export default XimimageTool

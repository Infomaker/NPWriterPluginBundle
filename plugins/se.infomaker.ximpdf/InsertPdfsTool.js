import {Tool} from 'substance'

class XimpdfsTool extends Tool {

    render($$) {
        var el = $$('div')
        el.attr('title', this.getLabel('Upload PDF document'))

        el.append(
            $$('button').addClass('se-tool').append(
                $$('i').addClass('fa fa-file-pdf-o')
            )
                .on('click', this.triggerFileDialog)
        );

        el.append(
            $$('input')
                .attr('type', 'file')
                .attr('multiple', 'multiple')
                .attr('id', 'x-im-pdf-fileupload')
                .ref('x-im-pdf-fileupload')
                .on('change', this.triggerFileUpload)
        );

        return el;
    }

    triggerFileDialog() {
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, false);
        this.refs['x-im-pdf-fileupload'].el.el.dispatchEvent(evt);

    }

    triggerFileUpload(ev) {
        this.context.editorSession.executeCommand('insert-pdfs', {
            files: ev.target.files
        })
    }
}

export default XimpdfsTool

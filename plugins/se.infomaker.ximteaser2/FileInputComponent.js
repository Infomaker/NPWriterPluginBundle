import {Component, FontAwesomeIcon} from 'substance'

class FileInputComponent extends Component {

    render($$) {

        const uploadbutton = $$('span')
            .addClass('upload-button')
            .append($$(FontAwesomeIcon, {icon: 'fa-upload'}))
            .on('click', this.triggerFileDialog)
            .attr('title', this.getLabel('Upload image'))


        const fileInput = $$('input')
            .attr('type', 'file')
            .attr('multiple', 'multiple')
            .ref('fileInput')
            .on('change', this.props.onChange)

        return $$('span').addClass('fileinput').append([uploadbutton, fileInput])
    }

    triggerFileDialog() {
        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click', true, false)
        this.refs.fileInput.el.el.dispatchEvent(evt)
    }

}

export default FileInputComponent

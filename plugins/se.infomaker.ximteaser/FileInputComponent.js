import {Component, FontAwesomeIcon} from 'substance'
import {getMIMETypes} from '../se.infomaker.ximimage/models/ImageTypes'

/**
 * @property {{onChange: {Function}}}
 */
class FileInputComponent extends Component {

    render($$) {
        const uploadButton = $$('span')
            .addClass('upload-button')
            .append($$(FontAwesomeIcon, {icon: 'fa-upload'}))
            .on('click', this.triggerFileDialog)
            .attr('title', this.getLabel('Upload image'))

        const fileInput = $$('input')
            .attr('type', 'file')
            .attr('multiple', 'multiple')
            .attr('accept', getMIMETypes().join(','))
            .ref('fileInput')
            .on('change', this.props.onChange)

        return $$('span').addClass('fileinput').append([uploadButton, fileInput])
    }

    triggerFileDialog() {
        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click', true, false)
        this.refs.fileInput.el.el.dispatchEvent(evt)
    }
}

export default FileInputComponent

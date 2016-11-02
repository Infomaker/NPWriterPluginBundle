const { Component } = substance

class XimimageComponent extends Component {

    didMount() {
        // Trigger upload dialog
        this.refs.fileInput.click()
        this.props.node.on('upload:progress', this._onProgress, this)
    }

    _onProgress(progressValue) {
        this.refs.progressbar.setProps({
            progress: progressValue
        })
    }

    render() {
        let Button = this.getComponent('button')
        let el = $$('div').addClass('sc-image')
        let state = this.props.node.getState()

        el.append($$(Graphic, {
            url: "",
            preview: this.props.node.state === 'uploading'
        }))

        if (state === 'uploading') {
            el.append(
                $$(Progressbar, { progress: 0 })
                .ref('progressbar')
            )
        }

        if (state === 'error') {
            el.append(this.props.node.getErrorMessage())
            // Render retry button?
        }

        // el.append(
        //     $$('input')
        //         .attr('type', 'file')
        //         .ref('fileInput')
        //         // .attr('multiple', 'multiple')
        //         .on('change', this._onFileSelected)
        // )

        return el
    }
}

export default XimimageComponent
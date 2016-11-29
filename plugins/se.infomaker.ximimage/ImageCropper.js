import { Component } from 'substance'

const {api} = writer

/*
  Used in ImageDisplay
*/
class ImageCropper extends Component {
    didMount() {
        debugger
        // let div = this.refs['cropper'].el
        this.cropEditor = new IMSoftcrop.Editor( // eslint-disable-line
            'ximimage__softcrop',
            {
                autocrop: true,
                detectWorkerUrl: 'node_modules/cropjs/dist/js/imcrop.worker.detect.js',
                detectThreshold: 30,
                detectStepSize: 3,
                debug: false
            }
        )

        let definedCrops = api.getConfigValue('ximimage', 'crops', []),
            encodedSrc = encodeURIComponent(this.props.src)

        this.cropEditor.addImage(
            '/api/resourceproxy?url=' + encodedSrc,
            () => {
                let selected = true
                definedCrops.forEach(crop => {
                    this.createCrop(crop.name, selected, crop)
                    selected = false
                })
                // var selected = true
                // for(var name in definedCrops) {
                //     // if (this.props.crops && this.props.crops.original) {
                //     //     this.addCrop(name, selected, definedCrops[name], this.props.crops.original);
                //     // }
                //     // else {
                //         this.createCrop(name, selected, definedCrops[name]);
                //     // }
                //     selected = false;
                // }
            }
        )
    }

    createCrop(name, selected, definedCrop) {
        this.cropEditor.addSoftcrop(
            name,
            selected,
            definedCrop[0],
            definedCrop[1]
        )
    }

    render($$) {
        return $$('div')
            .attr('id', 'ximimage__softcrop')
            .addClass('sc-image-cropper')
            .ref('cropper')
            .append('cool')

        // el.append('TODO: Implement image cropper here')
        // return el
    }
}

export default ImageCropper

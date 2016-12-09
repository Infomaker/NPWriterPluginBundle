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
                detectWorkerUrl: null, // FIXME: Use 'node_modules/cropjs/dist/js/imcrop.worker.detect.js',
                detectThreshold: 30,
                detectStepSize: 3,
                debug: false
            }
        )

        let definedCrops = api.getConfigValue('se.infomaker.ximimage', 'crops', [])

        this.cropEditor.addImage(
            this.props.src,
            () => {
                let selected = true
                // definedCrops.forEach(crop => {
                //     this.createCrop(crop.name, selected, crop)
                //     selected = false
                // })

                for(var name in definedCrops) {
                    if (this.props.crops) {
                        this.addCrop(name, selected, definedCrops[name], this.props.crops);
                    }
                    else {
                        this.createCrop(name, selected, definedCrops[name]);
                    }
                    selected = false;
                }
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

    addCrop(name, selected, definedCrop, existingCrops) {
        var existingCrop = null
        for (var n = 0; n < existingCrops.crops.length; n++) {
            if (existingCrops.crops[n].name === name) {
                existingCrop = existingCrops.crops[n]
                break;
            }
        }

        if (!existingCrop) {
            console.warn('Existing crop ' + name + ' not defined in configuration. Ignoring!')
            this.createCrop(name, selected, definedCrop)
            return
        }

        let imageWidth = this.props.width
        let imageHeight = this.props.height
        let matches = this.props.src.match(/&w=([0-9]*)/)

        if (Array.isArray(matches) && matches.length === 2) {
            imageWidth = matches[1]
            imageHeight = Math.round((imageWidth / this.props.width) * this.props.height)
        }

        this.cropEditor.addSoftcrop(
            name,
            selected,
            Math.round(existingCrop.width * imageWidth),
            Math.round(existingCrop.height * imageHeight),
            Math.round(existingCrop.x * imageWidth),
            Math.round(existingCrop.y * imageHeight)
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

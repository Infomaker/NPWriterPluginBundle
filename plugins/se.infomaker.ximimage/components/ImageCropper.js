import { Component } from 'substance'

/*
  Used in ImageDisplay
*/
class ImageCropper extends Component {
    constructor(...args) {
        super(...args)
    }

    getInitialState() {
        return {
            disableAutomaticCrop: this.props.disableAutomaticCrop === true
        }
    }

    // Never rerender this component as the crop looses it
    shouldRerender(newProps, newState) { // eslint-disable-line
        return false
    }

    didMount() {
        this.cropEditor = new IMSoftcrop.Editor( // eslint-disable-line
            'ximimage__softcrop',
            {
                autocrop: false,
                //detectWorkerUrl: false, // FIXME: Use 'node_modules/cropjs/dist/js/imcrop.worker.detect.js',
                //detectThreshold: 30,
                //detectStepSize: 3,
                debug: false
            }
        )

        let configuredCrops = this.props.configuredCrops || [],
            encodedSrc = encodeURIComponent(this.props.src)

        this.disableAutomaticCrop = this.props.disableAutomaticCrop

        this.cropEditor.addImage(
            '/api/resourceproxy?url=' + encodedSrc,
            () => {
                let selected = true
                for(const name in configuredCrops) {
                    if (this.props.crops) {
                        this.addCrop(name, selected, configuredCrops[name], this.props.crops)
                    }
                    else {
                        this.createCrop(name, selected, configuredCrops[name])
                    }
                    selected = false
                }
            }
        )
    }

    createCrop(name, selected, definedCrop) {
        // If there are no defined crops, new crops should be usable by default
        const usable = this.props.crops.length === 0

        this.cropEditor.addSoftcrop(
            name,
            selected,
            definedCrop[0],
            definedCrop[1],
            null,
            null,
            usable
        )
    }

    // FIXME: Does not work with existing crops already on the image
    addCrop(name, selected, definedCrop, existingCrops) {
        var existingCrop = null
        for (var n = 0; n < existingCrops.length; n++) {
            if (existingCrops[n].name === name) {
                existingCrop = existingCrops[n]
                break
            }
        }

        if (!existingCrop) {
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
        const Toggle = this.getComponent('toggle')
        const cropActions = $$('div').addClass('se-crop-actions');
        const softCropper = $$('div')
            .attr('id', 'ximimage__softcrop')
            .addClass('sc-image-cropper')
            .ref('cropper')
        const cropToggle = $$(Toggle, {
            id: 'crop-toggle',
            alignRight: true,
            label: this.getLabel('Disable automatic crop in frontend'),
            checked: this.state.disableAutomaticCrop,
            onToggle: (checked) => {
                this.extendState({
                    disableAutomaticCrop: checked
                })
            }
        })
        const cropOptions = $$('div').append(cropToggle).addClass('se-crop-options')
        const restoreAll = $$('button').addClass('btn btn-secondary').append(this.getLabel('Restore all')).on('click', this.props.restore)
        const abort = $$('button').addClass('btn pull-right btn-abort').append(this.getLabel('cancel')).on('click', this.onClose)
        const confirm = $$('button').addClass('btn pull-right btn-primary').append(this.getLabel('Save')).on('click', this.onSave)
        cropActions.append([
            restoreAll,
            confirm,
            abort,
        ])

        return $$('div').append([
            softCropper,
            cropOptions,
            cropActions
        ]).addClass('se-image-cropper-meta')
    }

    onClose() {
        this.props.abort()
        this.remove()
    }

    onSave() {
        let data = this.cropEditor.getSoftcropData(),
            crops = []

        data.crops.forEach( (crop) => {
            if (!crop.usable) {
                return
            }

            crops.push({
                name: crop.id,
                x: crop.x / data.width,
                y: crop.y / data.height,
                width: crop.width / data.width,
                height: crop.height / data.height
            })
        })

        this.props.save({ crops: crops }, this.state.disableAutomaticCrop);
    }
}

export default ImageCropper

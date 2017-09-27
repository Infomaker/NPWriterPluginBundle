import {Component, FontAwesomeIcon} from "substance";

function constructParams(instructions, key, crop) {
    const maxSide = 800

    let result = {};

    if (instructions) {
        if (instructions[key]) {
            result = instructions[key]
        } else if (instructions["default"]) {
            result = instructions["default"]
        }
    }

    const ratio = crop[0] / crop[1]

    if (ratio < 1) {
        result['w'] = (maxSide * ratio)
        result['h'] = maxSide
    } else {
        result['w'] = maxSide
        result['h'] = (maxSide / ratio)
    }

    return result;
}

class ImageCropsPreview extends Component {

    constructor(...args) {
        super(...args)
        this.cropUrls = new Map();
    }

    didMount() {
        const crops = this.props.crops
        const cropInstructions = this.props.cropInstructions

        for (let key in crops) {
            const params = constructParams(cropInstructions, key, crops[key]);

            this.props.node.getServiceUrl(params)
                .then((url) => {
                    this.cropUrls.set(key, url)
                    this.updateSrc(key, url)
                })
                .catch((e) => {
                    const url = ""
                    this.cropUrls.set(key, url)
                    this.updateSrc(key, url)
                })
        }
    }

    updateSrc(key, url) {
        if (this.refs['img-' + key]) {
            this.refs['img-' + key].setAttribute('src', url)
        }
    }

    render($$) {
        const el = $$('div').addClass('image-crops-container').ref('cropsPreviewContainer')

        const crops = this.props.crops
        for (let key in crops) {
            if (crops.hasOwnProperty(key)) {

                const cropDiv = $$('div').addClass('image-crops-item')
                cropDiv.append(
                    [
                        $$('img')
                            .setAttribute('src', this.cropUrls.get(key)).ref('img-' + key),
                        $$('div').addClass('image-crops-ratio-text image-crops-overlay').append(key)
                    ]
                )

                // Add marker to crop that it is user defined
                if (this.props.node.crops && this.props.node.crops.crops) {
                    const userDefinedCrops = this.props.node.crops.crops
                    for (let i = 0; i < userDefinedCrops.length; i++) {
                        if (userDefinedCrops[i].name === key) {
                            cropDiv.append(
                                $$(FontAwesomeIcon, {icon: 'fa-crop'}).addClass('image-crops-user-defined image-crops-overlay')
                            )
                        }
                    }
                }

                el.append(cropDiv)
            }

        }

        console.log(this.props.isolatedNodeState)

        return el
    }

}

export default ImageCropsPreview
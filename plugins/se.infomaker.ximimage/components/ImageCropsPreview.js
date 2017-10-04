import {Component, FontAwesomeIcon} from "substance";

function executeTemplate(template, context) {

    let result = template;

    for (let key in context) {
        result = result.replace(`{{${key}}}`, context[key])
    }

    return result
}

function getTemplate(key, cropObject) {
    if (cropObject[key]) {
        return cropObject[key]
    }

    return cropObject["default"]
}

function constructParams(instructions, key, crop, cropDefinedInNode, imageWidth, imageHeight) {
    const maxSide = 800

    let template = {}
    let context = {}

    if (cropDefinedInNode) {

        if (instructions && instructions.userDefined) {
            template = getTemplate(key, instructions.userDefined)
        }

        const relCropX = parseFloat(cropDefinedInNode.x)
        const relCropY = parseFloat(cropDefinedInNode.y)
        const relCropWidth = parseFloat(cropDefinedInNode.width)
        const relCropHeight = parseFloat(cropDefinedInNode.height)

        let w
        let h

        const ratio = crop[0] / crop[1]

        if (ratio < 1) {
            w = (maxSide * ratio)
            h = maxSide
        } else {
            w = maxSide
            h = (maxSide / ratio)
        }

        context = {
            cx: Math.floor(imageWidth * relCropX),
            cy: Math.floor(imageHeight * relCropY),
            cw: Math.floor(imageWidth * relCropWidth),
            ch: Math.floor(imageHeight * relCropHeight),
            w: Math.floor(w),
            h: Math.floor(h)
        }

    } else {

        if (instructions && instructions.auto) {
            template = getTemplate(key, instructions.auto)
        }

        let w
        let h

        const ratio = crop[0] / crop[1]

        if (ratio < 1) {
            w = (maxSide * ratio)
            h = maxSide
        } else {
            w = maxSide
            h = (maxSide / ratio)
        }

        context = {
            w: Math.floor(w),
            h: Math.floor(h)
        }

    }

    let result = executeTemplate(template, context)

    return result


}

class ImageCropsPreview extends Component {

    constructor(...args) {
        super(...args)
        this.cropUrls = new Map();
    }

    didMount() {
        this.fetchCropUrls()
    }

    fetchCropUrls() {
        const crops = this.props.crops
        const cropInstructions = this.props.cropInstructions
        const node = this.props.node
    
        for (let key in crops) {

            let cropDefinedInNode
            if (node.crops && node.crops.crops) {
                cropDefinedInNode = node.crops.crops.find((e) => e.name === key)
            }

            const width = node.width
            const height = node.height

            const params = constructParams(cropInstructions, key, crops[key], cropDefinedInNode, width, height);


            if (this.props.node.uuid) {
                this.props.node.getServiceUrl(params)
                    .then((url) => {
                        this.cropUrls.set(key, url)
                        this.updateSrc(key, url)
                    })
                    .catch(() => {
                        const url = ""
                        this.cropUrls.set(key, url)
                        this.updateSrc(key, url)
                    })
            }
        }

        // If crops has changed, clear the selected crop
        this.selectCrop(undefined)
    }

    updateSrc(key, url) {
        if (this.refs['img-' + key]) {
            this.refs['img-' + key].setAttribute('src', url)
        }
    }

    selectCrop(url) {
        if (url === undefined || this.state.selectedUrl === url) {
            this.extendState({selectedUrl: undefined})
        } else {
            this.extendState({selectedUrl: url})
        }

        this.props.cropSelected(this.state.selectedUrl)
    }

    render($$) {
        const el = $$('div').addClass('image-crops-container').ref('cropsPreviewContainer')

        const crops = this.props.crops
        for (let key in crops) {
            if (crops.hasOwnProperty(key)) {

                const url = this.cropUrls.get(key)
                const cropDiv = $$('div')
                    .addClass('image-crops-item')
                    .on('click', () => this.selectCrop(url))

                const img = $$('img')
                    .setAttribute('src', url).ref('img-' + key)

                if (this.state.selectedUrl) {
                    if (url === this.state.selectedUrl) {
                        img.addClass('crop-selected')
                    } else {
                        img.addClass('crop-unselected')
                    }
                }

                cropDiv.append(
                    [
                        img,
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

        return el
    }

}

export default ImageCropsPreview
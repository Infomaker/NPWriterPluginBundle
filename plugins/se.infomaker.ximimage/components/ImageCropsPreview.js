import {Component, FontAwesomeIcon} from "substance";

function executeTemplate(template, context) {

    let result = template;

    for (let key in context) {
        if (context.hasOwnProperty(key)) {
            result = result.replace(`{{${key}}}`, context[key])
        }
    }

    return result
}

function getTemplate(key, cropObject) {
    if (cropObject[key]) {
        return cropObject[key]
    }

    return cropObject["default"]
}

function ensureFloat(value) {
    const float = parseFloat(value)

    if (float === 1) {
        return 0.999999
    }

    return float
}

function constructParams(instructions, key, crop, cropDefinedInNode, imageWidth, imageHeight, uuid) {
    const maxSide = 800

    let template = {}
    let context = {}

    if (cropDefinedInNode) {

        if (instructions && instructions.userDefined) {
            template = getTemplate(key, instructions.userDefined)
        }

        const relCropX = ensureFloat(cropDefinedInNode.x)
        const relCropY = ensureFloat(cropDefinedInNode.y)
        const relCropWidth = ensureFloat(cropDefinedInNode.width)
        const relCropHeight = ensureFloat(cropDefinedInNode.height)

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
            cxrel: relCropX,
            cyrel: relCropY,
            cwrel: relCropWidth,
            chrel: relCropHeight,
            cx: Math.floor(imageWidth * relCropX),
            cy: Math.floor(imageHeight * relCropY),
            cw: Math.floor(imageWidth * relCropWidth),
            ch: Math.floor(imageHeight * relCropHeight),
            w: Math.floor(w),
            h: Math.floor(h),
            uuid: uuid
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

    return executeTemplate(template, context)
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
        const {fileManager} = this.context.api.editorSession

        // Ensure file for image has been uploaded before fetching its crop-urls
        fileManager.sync()
            .then(() => {
                for (let key in crops) {
                    if (crops.hasOwnProperty(key)) {
                        let cropDefinedInNode
                        if (node.crops && node.crops.crops) {
                            cropDefinedInNode = node.crops.crops.find((e) => e.name === key)
                        }

                        const width = node.width
                        const height = node.height
                        const params = constructParams(cropInstructions, key, crops[key], cropDefinedInNode, width, height, this.props.node.uuid);

                        if (this.props.node.uuid && this.props.node.getServiceUrl) {
                            this.props.node.getServiceUrl(params)
                                .then((url) => {
                                    this.cropUrls.set(key, url)
                                    this.updateSrc(key, url)
                                })
                                .catch((e) => {
                                    console.warn(e)
                                    const url = ""
                                    this.cropUrls.set(key, url)
                                    this.updateSrc(key, url)
                                })
                        }
                    }
                }
            })

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

                const url = this.cropUrls.get(key)
                const cropDiv = $$('div')
                    .addClass('image-crops-item')

                const img = $$('img')
                    .setAttribute('src', url).ref('img-' + key)

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

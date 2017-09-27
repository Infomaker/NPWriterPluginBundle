import {Component, Button, FontAwesomeIcon} from "substance";
import {api} from "writer";
import ImageCropper from "./ImageCropper";
import AddToByline from "./AddToByline";

/*
 Intended to be used in Ximimage and Ximteaser and other content types
 that include an imageFile property.
 */
class ImageDisplay extends Component {

    constructor(...args) {
        super(...args)
    }

    _onDragStart(e) {
        e.preventDefault()
        e.stopPropagation()

    }

    render($$) {
        let imgContainer = $$('div').addClass('se-image-container checkerboard').ref('imageContainer')
        let imgSrc
        try {
            this.hasLoadingErrors = false
            imgSrc = this.props.node.getUrl()
        } catch(e) {
            this.hasLoadingErrors = e
        }

        const imageFile = this.context.doc.get(this.props.node.imageFile)
        if (!imageFile) {
            this.hasLoadingErrors = 'Missing image file'
        }

        let contentElement = $$(FontAwesomeIcon, { icon: 'fa-picture-o'}).attr('style', 'font-size:25rem;color:#efefef')

        if (imgSrc && !this.hasLoadingErrors) {
            if (this.props.removeImage) {
                const deleteButton = $$(Button, {icon: 'remove'})
                    .addClass('remove-image__button')
                    .attr('title', this.getLabel('remove-image-button-title'))
                    .on('click', () => {
                        this.props.removeImage()
                    })

                imgContainer.append(deleteButton)
            }

            contentElement = $$('img', {
                src: imgSrc
            }).ref('img')

        } else if(this.hasLoadingErrors) {
            contentElement = $$(FontAwesomeIcon, { icon: 'fa-chain-broken'})
                .attr('style', 'font-size:4rem;')
                .addClass('broken-image')
                .attr('title', this.getLabel('Image could not be found'))
        }

        imgContainer.append(contentElement)

        const actionsEl = $$('div').addClass('se-actions')

        if (!this.hasLoadingErrors && imageFile.uuid && api.getConfigValue(this.props.parentId, 'byline')) {
            actionsEl.append(
                $$(Button, {
                    icon: 'user-plus'
                }).on('click', this._openAddToByline)
            )
        }

        if (!this.hasLoadingErrors && imageFile.uuid && api.getConfigValue(this.props.parentId, 'imageinfo')) {
            actionsEl.append(
                $$(Button, {
                    icon: 'image'
                }).on('click', this._openMetaData)
            )
        }

        if (!this.hasLoadingErrors && imageFile.uuid && api.getConfigValue(this.props.parentId, 'softcrop')) {
            const configuredCrops = api.getConfigValue(this.props.parentId, 'crops', [])
            let currentCrops = 0
            let cropBadgeClass = false

            if(this.props.node.crops && Array.isArray(this.props.node.crops.crops)) {
                currentCrops = this.props.node.crops.crops.length
            }

            const definedCrops = (Array.isArray(configuredCrops)) ? configuredCrops.length : Object.keys(configuredCrops).length
            if (currentCrops < definedCrops) {
                cropBadgeClass = 'se-warning'
            }

            actionsEl.append(
                $$(Button, {
                    icon: 'crop'
                })
                .on('click', this._openCropper)
                .append(
                    $$('em').append(
                        currentCrops
                    )
                    .addClass(cropBadgeClass)
                )
            )
        }

        // TODO: Implement correctly
        // const disableCrop = $$('span')
        //     .addClass('fa-stack fa-lg')
        //     .append([
        //         $$('i').addClass('fa fa-crop fa-stack-1x'),
        //         $$('i').addClass('fa fa-ban fa-stack-2x text-danger')
        //     ])
        //
        // actionsEl.append(
        //     $$(Button).append(disableCrop)
        // )

        imgContainer.append(actionsEl)

        let el = $$('div').addClass('sc-image-display')

        if (!this.hasLoadingErrors && !imageFile.uuid) {
            el.addClass('sm-pending')
        }


        el.addClass('sm-' + this.props.isolatedNodeState)
        el.append(imgContainer)

        return el
    }

    _openMetaData() {
        api.router.getNewsItem(this.props.node.uuid, 'x-im/image')
            .then(response => {
                api.ui.showDialog(
                    this.getComponent('dialog-image'),
                    {
                        node: this.props.node,
                        url: this.props.node.getUrl(),
                        newsItem: response,
                        disablebylinesearch: !api.getConfigValue(this.props.parentId, 'bylinesearch')
                    },
                    {
                        title: this.getLabel('Image archive information'),
                        global: true,
                        primary: this.getLabel('Save'),
                        secondary: this.getLabel('Cancel'),
                        cssClass: 'np-image-dialog'
                    }
                )
            })
    }

    _openAddToByline() {
        api.ui.showDialog(
            AddToByline,
            {
                node: this.props.node,
                addAuthor: (author) => {
                    this.props.node.addAuthor(author)
                }
            },
            {
                title: this.getLabel('Add to image byline'),
                global: true,
                primary: this.getLabel('Close'),
                secondary: false
            }
        )
    }

    _openCropper() {
        let tertiary = false;
        if (this.props.node.crops) {
            tertiary = [{
                caption: this.getLabel('Remove'),
                callback: () => {
                    this.props.node.setSoftcropData([]);
                    return true;
                }
            }];
        }

        this.props.node.fetchSpecifiedUrls(['service', 'original'])
        .then(src => {
            api.ui.showDialog(
                ImageCropper,
                {
                    parentId: this.props.parentId,
                    src: src,
                    width: this.props.node.width,
                    height: this.props.node.height,
                    crops: this.props.node.crops.crops || [],
                    disableAutomaticCrop: this.props.node.disableAutomaticCrop,
                    callback: (crops, disableAutomaticCrop) => {
                        this.props.node.setSoftcropData(crops, disableAutomaticCrop)
                    }
                },
                {
                    tertiary: tertiary,
                    cssClass: 'np-crop-dialog'
                }
            )
        })
        .catch(err => {
            console.error(err)
            api.ui.showMessageDialog([{
                type: 'error',
                message: this.getLabel('The image doesn\'t seem to be available just yet. Please wait a few seconds and try again.')
            }])
        })
    }
}

export default ImageDisplay

import {Button, Component, FontAwesomeIcon} from "substance";
import {api, UIImageCropper, UIDialogImage} from "writer";

/*
 Intended to be used in Ximimage and Ximteaser and other content types
 that include an imageFile property.
 */
class ImageDisplay extends Component {

    _onDragStart(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    getInitialState () {
        return { 
            cropButtonClicked: false,
            metadataButtonClicked: false
        }
    }

    displayCrop(cropUrl) {
        this.extendState({cropUrl: cropUrl});
    }

    getCropUrl() {
        if (this.props.isolatedNodeState !== null && this.state.cropUrl !== undefined) {
            return this.state.cropUrl
        }
        return this.props.node.getUrl()
    }

    render($$) {
        const {cropButtonClicked, metadataButtonClicked} = this.state

        let el = $$('div').addClass('sc-image-display')
        let cropOverlay = $$('div').addClass('crop-overlay hidden').ref('cropOverlay')
        let imgContainer = $$('div').addClass('se-image-container checkerboard').ref('imageContainer')
        const imageOptions = this.props.imageOptions
        let imgSrc

        try {
            this.hasLoadingErrors = false
            imgSrc = this.getCropUrl()
        } catch (e) {
            this.hasLoadingErrors = e
        }

        const imageFile = this.context.doc.get(this.props.node.imageFile)

        if (!imageFile) {
            this.hasLoadingErrors = 'Missing image file'
        }

        let contentElement = $$(FontAwesomeIcon, {icon: 'fa-picture-o'}).attr('style', 'font-size:25rem;color:#efefef')

        if (imgSrc && !this.hasLoadingErrors) {
            if (this.props.removeImage) {
                const deleteButton = $$(Button, {icon: 'remove'})
                    .addClass('remove-image__button')
                    .attr('title', this.getLabel('remove-image-button-title'))
                    .on('click', this.props.removeImage)

                imgContainer.append(deleteButton)
            }

            contentElement = $$('img', {
                src: imgSrc
            }).ref('img')

        } else if (this.hasLoadingErrors) {
            contentElement = $$(FontAwesomeIcon, {icon: 'fa-chain-broken'})
                .attr('style', 'font-size:4rem;')
                .addClass('broken-image')
                .attr('title', this.getLabel('Image could not be found'))
        }

        imgContainer.append(contentElement)

        const actionsEl = $$('div').addClass('se-actions')

        if (!this.hasLoadingErrors && imageFile.uuid && imageOptions.imageinfo) {
            actionsEl.append(
                $$(Button, {
                    icon: 'image'
                })
                .on('click', () => {
                    // Prevents multiple clicks
                    if (!metadataButtonClicked) {
                        this._openMetaData()
                        this.extendState({metadataButtonClicked: true})
                    }
                })

            )
        }

        if (!this.hasLoadingErrors && imageFile.uuid && this.props.node.uri && this.props.node.getOriginalUrl) {
            const fileName = this.props.node.getName ? this.props.node.getName() : 'unknown'
            actionsEl.append(
                $$('a').append($$(Button, {
                    icon: 'download'
                }))
                    .attr('href', '')
                    .attr('download', fileName)
                    .attr('title', this.getLabel('download-image-button-title'))
                    .on('click', (evt) => {
                        evt.preventDefault()
                        this._downloadOriginalImage()
                    })
            )
        }

        if (!this.hasLoadingErrors && imageFile.uuid && imageOptions.softcrop) {
            const configuredCrops = imageOptions.crops || []
            let currentCrops = 0
            let cropBadgeClass = false

            if (this.props.node.crops && Array.isArray(this.props.node.crops.crops)) {
                currentCrops = this.props.node.crops.crops.length
            }

            const definedCrops = (Array.isArray(configuredCrops)) ? configuredCrops.length : Object.keys(configuredCrops).length
            if (currentCrops < definedCrops) {
                cropBadgeClass = 'se-warning'
            }

            actionsEl.append($$(Button, {icon: 'crop'})
                .on('click', () => {
                    // Prevents multiple clicks
                    if (!cropButtonClicked) {
                        this._openCropper($$)
                        this.extendState({cropButtonClicked: true})
                    }
                })
                .append($$('em').append(currentCrops).addClass(cropBadgeClass))
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

        if (!this.hasLoadingErrors && !imageFile.uuid) {
            el.addClass('sm-pending')
        }

        el.addClass('sm-' + this.props.isolatedNodeState)
        el.append(cropOverlay)
        el.append(imgContainer)

        return el
    }

    /**
     * Download copy of original image
     */
    _downloadOriginalImage() {
        if (this.props.node.downloadOriginalImage) {
            this.props.node.downloadOriginalImage()
        } else {
            console.warn('Failed to download original image. Node missing download function')
        }
    }

    /**
     * Show image cropper in an overlay element
     *
     * @param {any} $$
     * @memberof ImageDisplay
     */
    _openCropper($$) {
        const imageOptions = this._getImageOptions()
        this.props.node.fetchSpecifiedUrls(['service', 'original'])
            .then(src => {
                let cropper = $$(UIImageCropper, {
                    parentId: this.props.parentId,
                    src: src,
                    width: this.props.node.width,
                    height: this.props.node.height,
                    crops: this.props.node.crops.crops || [],
                    configuredCrops: imageOptions.crops,
                    hideDisableCropsCheckbox: imageOptions.hideDisableCropsCheckbox,
                    disableAutomaticCrop: this.props.node.disableAutomaticCrop,
                    abort: () => {
                        this.refs.cropOverlay.addClass('hidden')
                        this.extendState({cropButtonClicked: false})
                        return true;
                    },
                    restore: () => {
                        this.props.node.setSoftcropData([]);
                        if (this.props.notifyCropsChanged) {
                            this.props.notifyCropsChanged()
                        }
                        this.extendState({cropButtonClicked: false})
                        return false;
                    },
                    save: (newCrops, disableAutomaticCrop) => {
                        this.props.node.setSoftcropData(newCrops, disableAutomaticCrop)
                        if (this.props.notifyCropsChanged) {
                            this.props.notifyCropsChanged()
                        }
                        this.extendState({cropButtonClicked: false})
                    }
                })

                this.refs.cropOverlay.removeClass('hidden')
                this.refs.cropOverlay.append(cropper)
            })
            .catch(err => {
                console.error(err)
                api.ui.showMessageDialog([{
                    type: 'error',
                    message: `${this.getLabel('The image doesn\'t seem to be available just yet. Please wait a few seconds and try again.')}\n\n${err}`
                }])
            })
    }

    /**
     * Fetches image options either from supplied props or
     * configuration values for props.parentId. Needed for
     * teaser-plugin backwards compatibility
     *
     * @returns {*}
     * @private
     */
    _getImageOptions() {
        if (this.props.imageOptions) {
            return this.props.imageOptions
        } else {
            // Old ximteaser needs this way of fetching imageOptions for backwards compatibility
            return ['byline', 'imageinfo', 'softcrop', 'crops', 'bylinesearch', 'hideDisableCropsCheckbox'].reduce((optionsObject, field) => {
                optionsObject[field] = api.getConfigValue(this.props.parentId, field)
                return optionsObject
            }, {})
        }
    }

    /**
     * Show image meta data in a modal dialog
     *
     * @memberof ImageDisplay
     */
    _openMetaData() {
        api.router.getNewsItem(this.props.node.uuid, 'x-im/image')
            .then(response => {
                this.extendState({medataButtonClicked: false})
                api.ui.showDialog(
                    UIDialogImage,
                    {
                        node: this.props.node,
                        url: this.props.node.getUrl(),
                        newsItem: response,
                        disablebylinesearch: !this.props.imageOptions.bylinesearch,
                        focusOnRender: true
                    },
                    {
                        title: this.getLabel('Image archive information'),
                        global: true,
                        primary: this.getLabel('Save'),
                        secondary: this.getLabel('Cancel'),
                        cssClass: 'np-image-dialog hide-overflow',
                        focusPrimary: false
                    }
                )
            })
    }

}

export default ImageDisplay

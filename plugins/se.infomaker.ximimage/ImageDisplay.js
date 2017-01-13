import {Component, Button, FontAwesomeIcon} from "substance";
import {api} from "writer";
import ImageCropper from "./ImageCropper";
import XimimageAddToBylineComponent from "./XimimageAddToBylineComponent";

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
        let imgContainer = $$('div').addClass('se-image-container').ref('imageContainer'),
            imgSrc = this.props.node.getUrl()

        if (imgSrc) {
            if (this.props.removeImage) {
                const deleteButton = $$(Button, {icon: 'remove'})
                    .addClass('remove-image__button')
                    .attr('title', this.getLabel('remove-image-button-title'))
                    .on('click', () => {
                        this.props.removeImage()
                    })

                imgContainer.append(deleteButton)
            }

            imgContainer.append(
                $$('img', {
                    src: imgSrc
                }).ref('img')
            )
        }
        else {
            imgContainer.append(
                $$(FontAwesomeIcon, {
                    icon: 'fa-picture-o'
                })
                    .attr('style', 'font-size:25rem;color:#efefef')
            )
        }

        const imageFile = this.context.doc.get(this.props.node.imageFile)
        const actionsEl = $$('div').addClass('se-actions')

        if (imageFile.uuid && api.getConfigValue(this.props.parentId, 'byline')) {
            actionsEl.append(
                $$(Button, {
                    icon: 'user-plus'
                }).on('click', this._openAddToByline)
            )
        }

        if (imageFile.uuid && api.getConfigValue(this.props.parentId, 'imageinfo')) {
            actionsEl.append(
                $$(Button, {
                    icon: 'image'
                }).on('click', this._openMetaData)
            )
        }

        if (imageFile.uuid && api.getConfigValue(this.props.parentId, 'softcrop')) {
            actionsEl.append(
                $$(Button, {
                    icon: 'crop'
                }).on('click', this._openCropper)
            )
        }

        imgContainer.append(actionsEl)

        let el = $$('div').addClass('sc-image-display')
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
                        newsItem: response,
                        disablebylinesearch: !api.getConfigValue(this.props.parentId, 'bylinesearch')
                    },
                    {
                        title: this.getLabel('Image archive information'),
                        global: true,
                        primary: this.getLabel('Save'),
                        secondary: this.getLabel('Cancel')
                    }
                )
            })
    }

    _openAddToByline() {
        api.ui.showDialog(
            XimimageAddToBylineComponent,
            {
                authors: this.props.node.authors,
                removeAuthor: () => (author) => {
                    this.props.node.removeAuthor(author)
                },
                addAuthor: (author, cbDone) => {
                    const authors = this.props.node.authors
                    authors.push(author)

                    this.props.node.setAuthors(authors)

                    cbDone();
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

        api.ui.showDialog(
            ImageCropper,
            {
                parentId: this.props.parentId,
                src: this.props.node.getUrl(),
                width: this.props.node.width,
                height: this.props.node.height,
                crops: this.props.node.crops.crops || [],
                callback: (crops) => {
                    this.props.node.setSoftcropData(crops)
                }
            },
            {
                tertiary: tertiary
            }
        )
    }
}

export default ImageDisplay

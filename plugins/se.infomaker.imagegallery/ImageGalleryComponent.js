import {Component, FontAwesomeIcon} from 'substance'
import {api, idGenerator} from 'writer'
import { INSERT_IMAGE_COMMAND, IMAGE_GALLERY_ICON } from './ImageGalleryNode';
import dragStateDataExtractor from '../se.infomaker.ximteaser/dragStateDataExtractor'

class ImageGalleryComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this.onDocumentChange, this)
    }

    onDocumentChange(change) {
        if (change.isAffected(this.props.node.id)) {
            if (this.refs.generericCaptionInput) {
                this.rerender()
            } else if (this.refs.generericCaptionInput && !change.isAffected(this.refs.generericCaptionInput.props.id)) {
                this.render()
            }
        } else if (this.props.node.imageFiles) {
            this.props.node.imageFiles.forEach(imageFile => {
                if (change.isAffected(imageFile.id)) {
                    this.render()
                }
            })
        }
    }

    render($$) {
        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        const dropZoneText = $$('div').addClass('dropzone-text').append(this.getLabel('Dropzone label'))
        const dropzone = $$('div').addClass('image-gallery-dropzone').append(dropZoneText)
        const imageGalleryToolbox = $$('div').addClass('image-gallery-toolbox')
        const generericCaptionInput = $$(FieldEditor, {
            id: idGenerator(),
            node: this.props.node,
            disabled: false,
            multiLine: false,
            field: 'genericCaption',
            placeholder: this.getLabel('Generic caption'),
            icon: 'fa-align-left'
        }).ref('generericCaptionInput')
        const genericCaptionWrapper = $$('div').append(generericCaptionInput)

        imageGalleryToolbox.append(this.renderHeader($$))

        if (this.props.isolatedNodeState) {
            imageGalleryToolbox.addClass('show')

            if (this.props.node.imageFiles && this.props.node.imageFiles.length) {
                let thumbnailsWrapper = $$('div').addClass('thumbnails-wrapper')

                this.props.node.imageFiles.forEach(imageFile => {
                    let imageWrapper = $$('div').addClass('image-wrapper')
                    let imageNode = this.props.node.document.get(imageFile)
                    let imageEl = $$('img', { src: imageNode.getUrl()})
                    imageWrapper.append(imageEl)
                    thumbnailsWrapper.append(imageWrapper)
                })
                imageGalleryToolbox.append(thumbnailsWrapper)
            }
        }

        const el = $$('div')
            .addClass('im-blocknode__container im-image-gallery')
            .append(this.renderHeader($$))
            .append(dropzone)
            .append(genericCaptionWrapper)
            .append(imageGalleryToolbox)
            .ref('imageGalleryComponent')

        return el
    }

    renderHeader($$) {
        const header = $$('div').addClass('image-gallery-header')
        const icon = $$(FontAwesomeIcon, {icon: IMAGE_GALLERY_ICON})
        const label = this.getLabel('Image gallery')

        header.append(icon).append(label)

        return header
    }

    getDropzoneSpecs() {
        return [{
            component: this,
            message: this.getLabel('Dropzone label'),
            dropParams: {
                action: 'imagegallery-add-image',
                nodeId: this.props.node.id,
            }
        }]
    }

    handleDrop(tx, dragState) {
        const dragData = dragStateDataExtractor.extractMultiple(dragState)
        api.editorSession.executeCommand(INSERT_IMAGE_COMMAND, {
            tx,
            context: {node: this.props.node},
            data: dragData
        })
    }
}

export default ImageGalleryComponent

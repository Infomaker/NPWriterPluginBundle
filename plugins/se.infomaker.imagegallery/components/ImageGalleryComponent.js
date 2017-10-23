import {Component, FontAwesomeIcon} from 'substance'
import {api, idGenerator} from 'writer'
import { INSERT_IMAGE_COMMAND, IMAGE_GALLERY_ICON } from '../ImageGalleryNode';
import dragStateDataExtractor from '../../se.infomaker.ximteaser/dragStateDataExtractor'
import ImageGalleryImageComponent from './ImageGalleryImageComponent'

class ImageGalleryComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this.onDocumentChange, this)
    }

    onDocumentChange(change) {
        if (change.isAffected(this.props.node.id)) {
            this.rerender()
        } else if (this.props.node.imageFiles) {
            this.props.node.imageFiles.forEach(imageFile => {
                if (change.isAffected(imageFile.id)) {
                    this.rerender()
                }
            })
        }
    }

    render($$) {
        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        const dropZoneText = $$('div').addClass('dropzone-text').append(this.getLabel('Dropzone label'))
        const dropzone = $$('div').addClass('image-gallery-dropzone').append(dropZoneText).ref('dropZone')
        const imageGalleryToolbox = $$('div').addClass('image-gallery-toolbox')
        const generericCaptionInput = $$(FieldEditor, {
            id: idGenerator(),
            node: this.props.node,
            disabled: false,
            multiLine: true,
            field: 'genericCaption',
            placeholder: this.getLabel('Generic caption'),
            icon: 'fa-align-left'
        }).ref('generericCaptionInput')
        const genericCaptionWrapper = $$('div').addClass('image-gallery-genericcaption').append(generericCaptionInput)

        imageGalleryToolbox.append(this.renderHeader($$))

        if (this.props.isolatedNodeState) {
            imageGalleryToolbox.addClass('show')

            if (this.props.node.imageFiles && this.props.node.imageFiles.length) {
                let toolboxContent = $$('div').addClass('toolboox-content')

                this.props.node.imageFiles.forEach((imageFile, index) => {
                    toolboxContent.append($$(ImageGalleryImageComponent, {
                        index,
                        imageFile,
                        isolatedNodeState: this.props.isolatedNodeState,
                        node: this.props.node,
                        removeImage: () => {
                            api.editorSession.transaction((tx) => {
                                let copy = this.props.node.imageFiles.concat()
                                copy.splice(index, 1)
                                tx.set([this.props.node.id, 'imageFiles'], copy)
                            })
                        }
                    }))
                })

                imageGalleryToolbox.append(toolboxContent)
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
        const imageCount = this.props.node.imageFiles ? this.props.node.imageFiles.length : 0
        const header = $$('div').addClass('image-gallery-header')
        const icon = $$(FontAwesomeIcon, {icon: IMAGE_GALLERY_ICON})
        const label = `${this.getLabel('Image gallery')} (${imageCount})`

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

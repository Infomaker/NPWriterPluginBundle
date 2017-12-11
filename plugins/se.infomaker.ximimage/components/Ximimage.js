import {Component} from "substance"
import ImageDisplay from "./ImageDisplay"
import ImageCropsPreview from "./ImageCropsPreview"

const {api} = writer

class XimimageComponent extends Component {

    didMount() {
        this.props.node.fetchAuthorsConcept()
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    _onDocumentChange(change) {
        if (change.isAffected(this.props.node.id) ||
            change.isAffected(this.props.node.imageFile)) {
            if (this.refs.cropsPreview) {
                this.refs.cropsPreview.fetchCropUrls()
            }
            this.rerender()
        }
    }

    grabFocus() {
        let caption = this.refs.caption
        if (caption) {
            this.context.editorSession.setSelection({
                type: 'property',
                path: caption.getPath(),
                startOffset: 0,
                surfaceId: caption.id
            })
        }
    }

    render($$) {
        let node = this.props.node
        let el = $$('div').addClass('sc-ximimage im-blocknode__container')
        let fields = api.getConfigValue('se.infomaker.ximimage', 'fields')
        let metaWrapper = $$('div').addClass('meta-wrapper').ref('metaWrapper')
        let cropsEnabled = api.getConfigValue('se.infomaker.ximimage', 'softcrop')
        let crops = api.getConfigValue('se.infomaker.ximimage', 'crops')
        let cropInstructions = api.getConfigValue('se.infomaker.ximimage', 'cropInstructions')

        // TODO: extract from full config when we can get that
        const imageOptions = ['byline', 'imageinfo', 'softcrop', 'crops', 'bylinesearch'].reduce((optionsObject, field) => {
            optionsObject[field] = api.getConfigValue('se.infomaker.ximimage', field)
            return optionsObject
        }, {})

        el.append(
            $$(ImageDisplay, {
                parentId: 'se.infomaker.ximimage',
                node,
                imageOptions,
                isolatedNodeState: this.props.isolatedNodeState,
                notifyCropsChanged: () => {
                    this.refs.cropsPreview.fetchCropUrls()
                }
            }).ref('image')
        )

        if (cropsEnabled && crops && cropInstructions) {
            el.append(
                $$(ImageCropsPreview, {
                    node,
                    crops,
                    cropInstructions,
                    isolatedNodeState: this.props.isolatedNodeState,
                }).ref('cropsPreview')
            )
        }

        metaWrapper.append(
            this._renderByline($$)
        )

        fields.forEach(obj => {
            if (obj.type === 'option') {
                metaWrapper.append(this.renderOptionField($$, obj))
            }
            else {
                metaWrapper.append(this.renderTextField($$, obj))
            }
        })

        el.append(metaWrapper)

        return el
    }

    get _showByline() {
        return api.getConfigValue('se.infomaker.ximimage', 'byline', true)
    }

    get _bylineSearchEnabled() {
        return this.context.api.getConfigValue('se.infomaker.ximimage', 'bylinesearch', true)
    }

    _renderByline($$) {
        if (this._showByline) {
            const BylineComponent = this.context.api.ui.getComponent('BylineComponent')
            return $$(BylineComponent, {
                node: this.props.node,
                bylineSearch: this._bylineSearchEnabled,
                isolatedNodeState: this.props.isolatedNodeState
            })
        }
    }

    renderTextField($$, obj) {
        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        return $$(FieldEditor, {
            node: this.props.node,
            field: obj.name,
            multiLine: false,
            disabled: Boolean(this.props.disabled),
            placeholder: obj.label,
            icon: this._getFieldIcon(obj.name) || 'fa-header'
        })
            .ref(obj.name)
            .attr('title', obj.label)
            .addClass('x-im-image-dynamic')
    }

    _getFieldIcon(name) {
        const icons = {
            caption: 'fa-align-left',
            credit: 'fa-building-o',
            alttext: 'fa-low-vision'
        }

        return icons[name]
    }

    renderOptionField($$, obj) {
        let options = [],
            currentOption = null

        if (!this.props.node.alignment) {
            currentOption = obj.options[0].name
            // this.props.node.setAlignment(currentOption)
        }
        else {
            currentOption = this.props.node.alignment
        }

        obj.options.forEach(option => {
            let selectedClass = (currentOption === option.name) ? ' selected' : ''

            options.push(
                $$('em')
                    .addClass('fa ' + option.icon + selectedClass)
                    .attr({
                        'contenteditable': 'false',
                        'title': option.label
                    })
                    .on('click', () => {
                        if (option.name !== this.props.node.alignment) {
                            this.props.node.setAlignment(option.name)
                            this.rerender()
                        }
                        return false
                    })
            );
        });

        return $$('div')
            .addClass('x-im-image-dynamic x-im-image-alignment')
            .attr({
                'contenteditable': 'false'
            })
            .append(options)
    }
}

export default XimimageComponent

import { Component, TextPropertyEditor } from 'substance'
import ImageDisplay from './ImageDisplay'

const {api} = writer

class XimimageComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    _onDocumentChange(change) {
        if (change.isAffected(this.props.node.id) ||
            change.isAffected(this.props.node.imageFile)) {
            this.rerender()
        }
    }

    render($$) {
        let node = this.props.node
        let el = $$('div').addClass('sc-ximimage')
        let fields = api.getConfigValue('se.infomaker.ximimage', 'fields')


        el.append(
            $$(ImageDisplay, {
                node: node,
                isolatedNodeState: this.props.isolatedNodeState
            }).ref('image')
        )

        fields.forEach(obj => {
            if (obj.type === 'option') {
                el.append(this.renderOptionField($$, obj))
            }
            else {
                el.append(this.renderTextField($$, obj))
            }
        })

        return el
    }

    // renderField($$) {
    //
    //     $$(TextPropertyEditor, {
    //             tagName: 'div',
    //             path: [this.props.node.id, 'caption'],
    //             doc: this.props.doc
    //         }).ref('caption').addClass('se-caption')
    //     )
    // }



    renderTextField($$, obj) {
        return $$(TextPropertyEditor, {
            tagName: 'div',
            path: [this.props.node.id, obj.name],
            doc: this.props.doc
        })
        .ref(obj.name)
        .attr('title', obj.label)
        .addClass('x-im-image-dynamic x-im-image-' + obj.name)
    }

    renderOptionField($$, obj) {
        let options = [],
            currentOption = null

        if (!this.props.node.alignment) {
            currentOption = obj.options[0].name
            this.props.node.setAlignment(currentOption)
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

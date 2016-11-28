import {Component, TextPropertyEditor, FontAwesomeIcon} from 'substance'
import {api} from 'writer'

class HeaderEditorComponent extends Component {

    constructor(...args) {
        super(...args)

        /**
         * Listen to all changes on the editorSession surface and
         * when the surface selected is not body show the icons
         */
        this.context.editorSession.onUpdate((editorSession) => {
            const surface = editorSession.getFocusedSurface()
            if(surface) {
                const icons = this.el.findAll('.fa')
                if (surface.name !== 'body') {
                    icons.forEach((icons) => {
                        icons.addClass('active');
                    })
                } else {
                    icons.forEach((icons) => {
                        icons.removeClass('active');
                    })
                }
            }
        }, this)

    }

    render($$) {
        const el = $$("div").addClass("sc-np-headereditor");
        const headerGroupFields = api.getConfigValue('se.infomaker.headereditor', 'elements') || ['headline', 'leadin'];
        const fields = headerGroupFields.map(function (field) {
            return this.getElement($$, field);
        }.bind(this));

        el.append(fields);

        return el;
    }

    getElement($$, field) {

        switch (field) {
            case 'headline':
                return this.getElementForField($$, field, 'fa-header');
            case 'leadin':
                return this.getElementForField($$, field, 'fa-paragraph');
            default:
                return this.getElementForField($$, field, 'fa-paragraph');
        }
    }

    getElementForField($$, field, fieldIcon) {
        const el = $$('span').addClass('sc-metdata-text__container').attr({
            'contenteditable': false,
            title: api.getLabel(field)
        });
        el.append($$(FontAwesomeIcon, {icon: fieldIcon}).attr({'contenteditable': false}));
        el.append($$(TextPropertyEditor, {
            name: field,
            tagName: "div",
            commands: this.props.headlineCommands,
            withoutBreak: false,
            path: [this.props.node.id, field]
        }).addClass('se-' + field))

        return el;
    }
}

export default HeaderEditorComponent

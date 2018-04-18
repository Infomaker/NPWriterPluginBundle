import {Component} from 'substance'
import {api, event} from 'writer'

class EditorialNoteComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    didMount() {
        api.events.on('notes', event.DOCUMENT_CHANGED, (event) => {
            if (event.data && event.data.type === 'ednote') {
                this.synchronize(event)
            }
        })
        api.events.on('notes', event.DOCUMENT_EXTERNAL_UPDATED, (event) => {
            if (event.data.key === 'edNote') {
                this.extendState({
                    note: api.newsItem.getEdNote()
                })
            }
        })
    }

    dispose(...args) {
        super.dispose(...args)
        api.events.off()
    }

    getInitialState() {
        return {
            note: api.newsItem.getEdNote()
        }
    }


    /**
     * Render and return a virtual dom element
     *
     * @returns {VirtualDomElement}
     */
    render($$) {
        var el = $$('div').addClass('sc-editorialnote')

        el.append([
            $$('h2').append(this.getLabel('Editorial note')),
            $$('fieldset').addClass('form-group').append(
                $$('div').addClass('form-group').append(
                    $$('textarea')
                        .ref('sc-editorialnote-content')
                        .on('keyup', () => {
                            this.setEditorialNote()
                        })
                        .addClass('form-control')
                        .attr({
                            rows: 5,
                            placeholder: this.getLabel("Editorial note")
                        })
                        .append(
                            this.state.note
                        )
                )
            )
        ])

        return el
    }


    setEditorialNote() {
        api.newsItem.setEdNote(
            this.refs['sc-editorialnote-content'].getValue()
        )
    }

    /**
     * Synchronize UI with newsML services/channels before rerendering
     */
    synchronize() {
        this.extendState({
            note: this.newsItem.getEdnote()
        })
    }
}

export default EditorialNoteComponent

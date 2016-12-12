import {Tool, Component, FontAwesomeIcon} from 'substance'
import {api} from 'writer'

class HtmlembedEditTool extends Tool {

    didMount() {
        this.resize()

        const textarea = this.refs.embedcode
        textarea.el.el.focus();

        // Listen for event to calculate new size on the textarea
        textarea.el.on('keydown', () => {
            this.resize()
        })
        textarea.el.el.addEventListener('paste', (e) => {
            this.resize()
        })
        textarea.el.el.addEventListener('cut', (e) => {
            this.resize()
        })
    }

    // Insert or update the embed
    insertEmbed() {
        api.editorSession.executeCommand('htmlembededit', {
            text: this.refs.embedcode.val()
        })
    }

    resize() {
        const htmlTexarea = this.refs.embedcode.el.el
        // Wait some time before change height so the scroll height is updated when pasting
        setTimeout(() => {
            htmlTexarea.style.height = 'auto'
            htmlTexarea.style.height = htmlTexarea.scrollHeight +20+ 'px'
        }, 100)

    }

    render($$) {
        const el = $$('div').addClass('embed-dialog');
        const embed = $$('textarea')
            .addClass('textarea')
            .attr('spellcheck', false)
            .ref('embedcode');

        if (this.props.text) {
            embed.append(this.props.text);
        }
        el.append(embed);
        return el;
    }


    /**
     * Called when user clicks close or save
     * @param status
     * @returns {boolean} Return false if we want to prevent dialog close
     */
    onClose(status) {
        if (status === "cancel") {

        }
        else if (status === "save") {
            if (typeof(this.props.text) !== 'undefined') {
                this.props.update(
                    this.refs.embedcode.val()
                );
            }
            else {
                this.insertEmbed();
            }

            return true;
        }

    }
}

export default HtmlembedEditTool
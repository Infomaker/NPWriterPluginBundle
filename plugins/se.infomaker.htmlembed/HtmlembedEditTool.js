import {Tool, Component, FontAwesomeIcon} from 'substance'

class HtmlembedEditTool extends Tool {
    insertEmbed() {
        this.getCommand().insertEmbedhtml(
            this.refs.embedcode.val()
        )

        this.send('close');
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

    didMount() {
        this.refs.embedcode.focus();
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
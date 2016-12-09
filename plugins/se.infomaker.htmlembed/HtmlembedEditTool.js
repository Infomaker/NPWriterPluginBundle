'use strict';


var SurfaceTool = require('substance/ui/SurfaceTool');
var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Icon = require('substance/ui/FontAwesomeIcon');

function HtmlembedEditComponent() {
    Component.apply(this, arguments);
}

HtmlembedEditComponent.Prototype = function() {

    this.insertEmbed = function() {
        this.getCommand().insertEmbedhtml(
            this.refs.embedcode.val()
        );

        this.send('close');
    };

    this.render = function() {
        var el = $$('div').addClass('embed-dialog');
        var embed = $$('textarea')
            .addClass('textarea')
            .attr('spellcheck', false)
            .ref('embedcode');

        if (this.props.text) {
            embed.append(this.props.text);
        }
        el.append(embed);
        return el;
    };

    this.didMount = function() {
        this.refs.embedcode.focus();
    };

    /**
     * Called when user clicks close or save
     * @param status
     * @returns {boolean} Return false if we want to prevent dialog close
     */
    this.onClose = function(status) {
        if (status === "cancel") {
            return;
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

    };
};

SurfaceTool.extend(HtmlembedEditComponent);

HtmlembedEditComponent.static.name = 'htmlembededit';
HtmlembedEditComponent.static.command = 'htmlembed';

module.exports = HtmlembedEditComponent;

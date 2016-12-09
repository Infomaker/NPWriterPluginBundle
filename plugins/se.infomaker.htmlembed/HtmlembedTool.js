'use strict';

var SurfaceTool = require('substance/ui/SurfaceTool');
var Component = require('substance/ui/Component');
var $$ = Component.$$;

function HtmlembedTool() {
    HtmlembedTool.super.apply(this, arguments);
}

HtmlembedTool.Prototype = function () {

    this.insertEmbedhtml = function () {
        this.context.api.showDialog(
            require('./HtmlembedEditTool'),
            {
                myProps: 'Insert HTML'
            },
            {
                title: "Embed HTML"
            }
        );
    };

    this.render = function () {
        var el = $$('button').addClass('se-tool').append(
            $$('i').addClass('fa fa-code')
        ).on('click', this.insertEmbedhtml);
        return el;
    };
};

SurfaceTool.extend(HtmlembedTool);

HtmlembedTool.static.name = 'htmlembed';
HtmlembedTool.static.command = 'htmlembed';

module.exports = HtmlembedTool;

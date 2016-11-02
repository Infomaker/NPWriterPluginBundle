const { Component, TextPropertyEditor } = substance
import XimteaserUpdater from './XimteaserUpdater'

/*
    STATUS: refactor in progress

    Changes:

        - Removed progress bar
        - Exclusigley use Substance render flow editorSession.onRender
        - XimteaeserUpdater fetches url if missing

    Possible improvements:

        - Factor out Toolbar to be used in Ximimage
        - Slim down
*/
class XimteaserComponent extends Component {

    didMount() {
        // Rerender on any model change
        this.context.editorSession.onRender('document', this.rerender, this, { path: [this.props.node.id] })

        // Updater makes sure missing async information is fetched and set on the node
        this.updater = new XimteaserUpdater(this.context.editorSession, this.props.node)
    }

    dispose() {
        super.dispose()
        this.updater.dispose()
        this.context.editorSession.off(this)
    }

    render($$) {
        var el = $$('div').append([
            $$('span').addClass('header').append([
                $$('strong').attr('contenteditable', 'false').append(this.getLabel('teaser')),
                $$('span').addClass('remove-button').append(
                    this.context.iconProvider.renderIcon($$, 'remove')
                )
                .on('click', this.removeTeaser)
                .attr('title',this.getLabel('remove-from-article')),
                $$('span').addClass('upload-button').append(
                    this.context.iconProvider.renderIcon($$, 'upload')
                )
                .on('click', this.triggerFileDialog)
                .attr('title', this.getLabel('upload-image'))
            ]),
            this.renderImage($$),
        ])
        .addClass('x-im-teaser');

        var fields = this.context.api.getConfigValue('ximteaser', 'fields', []);

        if (fields.indexOf('subject') >= 0) {
            if (this.props.node.url || this.props.node.previewUrl) {
                el.append(
                    $$(TextPropertyEditor, {
                        tagName: 'div',
                        path: [this.props.node.id, 'subject'],
                        doc: this.props.doc
                    }).ref('subject').addClass('x-im-teaser-subject')
                )
            }
        }

        el.append(
            $$(TextPropertyEditor, {
                tagName: 'div',
                path: [this.props.node.id, 'title'],
                doc: this.props.doc
            }).ref('caption').addClass('x-im-teaser-title')
        );

        if (fields.indexOf('text') >= 0) {
            el.append(
                $$(TextPropertyEditor, {
                    tagName: 'div',
                    path: [this.props.node.id, 'text'],
                    doc: this.props.doc
                }).ref('teasertext').addClass('x-im-teaser-text')
            )
        }

        el.addClass('x-im-droppable')
        el.on('drop', this._handleDrop)

        el.append(
            $$('input')
                .ref('fileInput')
                .attr('type', 'file')
                .attr('multiple', 'multiple')
                .attr('id', 'x-im-teaser-fileupload')
                .on('change', this.triggerFileUpload)
        )
        return el
    }


    /**
     * Render image
     */
    renderImage($$) {
        if (!this.props.node.previewUrl && !this.props.node.url && !this.props.node.uuid) {
            return $$('span')
        }

        var imgcontainer = $$('div'),
            img = $$('img').ref('img'),
            previewImg = $$('img').ref('previewimg');

        // Render preview if exists
        if (!this.props.node.url && this.props.node.previewUrl) {
            previewImg.attr('src', this.props.node.previewUrl);

            if (this.props.node.progress < 100) {
                previewImg.addClass('x-im-teaser-preview');
            }
            imgcontainer.append(previewImg)
            img.addClass('x-im-teaser-orig')
        }

        // Render real image if exists
        if (this.props.node.url) {
            img.attr('src', this.props.node.url);
            imgcontainer.append(img);
        }

        imgcontainer.append([
            this.renderImageRemoveButton($$),
            this.renderSoftcropIndication($$),
            this.renderToolbar($$)
        ])
        .attr('contenteditable', false)
        .ref('imgcontainer');

        // var progressbar = this.renderProgressbar($$);
        // if (progressbar) {
        //     imgcontainer.append(progressbar);
        // }

        return imgcontainer;
    }

    /**
     * Render remove icon
     */
    renderImageRemoveButton($$) {
        return $$('a').append(
            this.context.iconProvider.renderIcon($$, 'remove')
        ).on('click', this.removeImage)
        .addClass('x-im-removeimage');
    }

    /**
     * Render toolbar
     */
    renderToolbar($$) {
        var toolbar = $$('div')
            .addClass('x-im-teaser-toolbar')
            .attr('contenteditable', false);

        if (this.context.api.getConfigValue('ximteaser', 'enablesoftcrop')) {
            toolbar.append(
                $$('a').append(
                    this.context.iconProvider.renderIcon($$, 'crop')
                ).on('click', this.openCropDialog)
            )
        }

        toolbar.append([
            $$('a').append(
                this.context.iconProvider.renderIcon($$, 'image')
            ).on('click', this.openImageData)
        ])
        return toolbar
    }

    _handleDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        this.handleDrop(evt);
    }

    /**
     * Remove full teaser
     */
    removeTeaser() {
        this.context.api.deleteNode('ximteaser', this.props.node);
    }

    triggerFileDialog() {
        // $('#x-im-teaser-fileupload').click();
        console.info('TODO: trigger #x-im-teaser-fileupload')
    }

    /**
     * Render progress
     * <progress class="progress progress-striped progress-info" value="50" max="100">50%</progress>
     */
    // renderProgressbar($$) {
    //     var progressValue = this.props.node.progress

    //     return $$('progress')
    //         .addClass('progress')
    //         .val(progressValue)
    //         .attr('max', 100)
    //         .text(String(progressValue))
    //         .ref('progressbar')
    // }

    /**
     * Render soft crop indication
     */
    renderSoftcropIndication($$) {
        if (this.props.node.crops && this.props.node.crops.original) {
            return $$('a').append(
                this.context.iconProvider.renderIcon($$, 'crop')
            ).addClass('x-im-softcropindicator')
        }
        else {
            return $$('span');
        }
    }

    /**
     * Open image Dialog
     */
    openImageData() {
        var disablebylinesearch = this.context.api.getConfigValue(
            'ximimage',
            'disablebylinesearch',
            false
        )

        var DialogImage = this.getComponent('dialog-image')

        this.context.api.router.get('/api/newsitem/' + this.props.node.uuid, {imType: 'x-im/image'})
            .done(function (newsItem) {
                this.context.api.showDialog(
                    DialogImage,
                    {
                        url: this.props.node.url,
                        newsItem: newsItem,
                        disablebylinesearch: disablebylinesearch
                    },
                    {
                        title: this.getLabel('image-archive-information'),
                        primary: this.getLabel('save'),
                        secondary: this.getLabel('close')
                    }
                )
            }.bind(this))
            .error((error, xhr, text) => {
                // TODO: Display error message
                console.error(error, xhr, text)
            })
    }

    triggerFileUpload(ev) {
        this.editorSession.startWorkflow('replace-image', {
            path: [this.props.node.id, 'url']
        })
        // this.context.editorSession.executeCommand('ximteaser', {
        //     type:'file',
        //     data:ev.target.files,
        //     context: { nodeId: this.props.node.id }
        // })
    }

    /*
        Open crop dialog

        TODO: not yet tested

        QUESTION: Can't we have the needed crop data in our node locally? Having to fetch and parse
        XML here seems fragile. We should try to move out async code out of editable components, as
        they can cause a range of unwanted side-effects. E.g. during undo/redo
    */
    openCropDialog() {
        let XimimageSoftcropComponent = this.getComponent('xmimagesoftcrop')

        this.context.api.router.get('/api/newsitem/' + this.props.node.uuid, {imType: 'x-im/image'})
            .done(function (newsItem) {

                var domParser = new DOMParser(),
                    dom = domParser.parseFromString(newsItem, 'text/xml'),
                    widthEl = dom.querySelector('contentMeta > metadata > object > data > width'),
                    heightEl = dom.querySelector('contentMeta > metadata > object > data > height')

                var img = this.refs['img'].el
                if (!img) {
                    return
                }

                // QUESTION: what is tertiary ?
                var tertiary = false;
                if (this.props.node.crops.original) {
                    tertiary = [{
                        caption: this.getLabel('remove'),
                        callback: function() {
                            this.props.node.setSoftcropData([]);
                            return true;
                        }.bind(this)
                    }];
                }

                this.context.api.showDialog(
                    XimimageSoftcropComponent,
                    {
                        src: img.src,
                        width: widthEl.textContent,
                        height: heightEl.textContent,
                        crops: this.props.node.crops,
                        callback: this.setSoftcropData.bind(this)
                    },
                    {
                        tertiary: tertiary
                    }
                );
            }.bind(this))
            .error((error, xhr, text) => {
                // TODO: Display error message
                console.error(error, xhr, text);
            })
    }

    /**
     * Remove the image from the teaser
     */
    removeImage() {
        this.props.node.removeImage()
    }

    handleDrop(evt) {
        var surface = this.context.controller.getSurface('body')
        if (surface) {
            this.context.api.handleDrop(surface, evt, 'ximteaser', {
                nodeId: this.props.node.id
            })
        }
        return false
    }
}

// Makes isolated node display in full width
XimteaserComponent.fullWidth = true

export default XimteaserComponent

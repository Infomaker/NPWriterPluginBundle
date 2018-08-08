import {Component} from 'substance'

import JobImageInfoComponent from './JobImageInfoComponent'

class JobImageItem extends Component {

    getInitialState() {
        // TODO:
    }

    didMount() {
        // TODO:
    }

    render($$) {

        const divBox = $$('div')
            .addClass('box')
            .on('click', () => {
                this._showImageInfo();
            })

        if (this._isImage(this.props.jobImage.url)) {
            this.renderDragableImage($$, divBox, this.props.jobImage)
        } else {
            this.renderImage($$, divBox, this.props.jobImage)
        }

        return divBox
    }

    renderDragableImage($$, divBox, jobImage) {
        const ul = $$('ul')

        const listDrag = $$('li')
            .addClass('drag')
            .attr('draggable', true)
            .on('dragstart', this._onDragStart, this)
            .html(this._getSvg())

        const listContent = $$('li')
            .addClass('content')

        const divImage = $$('div')
            .addClass('imageplaceholder')
            .attr('style', 'background-image:url(' + jobImage.thumbUrl + ')')

        const label = $$('span')
            .addClass('title')
            .append(jobImage.name)

        listContent.append([label, divImage])

        ul.append([listDrag, listContent])

        divBox.append(ul)
    }

    renderImage($$, divBox, jobImage) {
        const ul = $$('ul').addClass('disabled')

        const listDrag = $$('li')
            .addClass('nodrag')

        const listContent = $$('li')
            .addClass('content')

        const divImage = $$('div')
            .addClass('imageplaceholder')
            .attr('style', 'background-image:url(' + jobImage.thumbUrl + ')')

        const label = $$('span')
            .addClass('title')
            .append(jobImage.name)

        const unsupportedLabel = $$('span')
            .addClass('unsupported')
            .append(this.getLabel('unsupported-format'))

        listContent.append([label, divImage, unsupportedLabel])

        ul.append([listDrag, listContent])

        divBox.append(ul)
    }

    _isImage(uri) {
        // Load allowed filextension from config file
        const fileExtensionsFromConfig = this.context.api.getConfigValue('se.infomaker.ximimage', 'imageFileExtension', ['jpeg', 'jpg', 'gif', 'png'])
        return fileExtensionsFromConfig.some((extension) => uri.includes(extension))
    }

    _onDragStart(e) {
        e.stopPropagation()

        let img = document.createElement('img');
        img.src = this.props.jobImage.thumbUrl;

        e.dataTransfer.setDragImage(img, 0, 0);
        e.dataTransfer.setData('text/uri-list', this.props.jobImage.url)
    }

    /**
     * Open dialog with image and metadata.
     *
     * @private
     */
    _showImageInfo() {
        this.context.api.ui.showDialog(JobImageInfoComponent, {
            jobImage: this.props.jobImage
        }, {
            secondary: false,
            title: this.getLabel('Image information'),
            global: true,
            cssClass: 'hide-overflow'
        })
    }

    _getSvg() {
        return '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"> <g> <rect x="7.9" y="1" class="st0" width="2.8" height="22"/> <rect x="13.4" y="1" class="st0" width="2.8" height="22"/> </g> </svg>'
    }
}

export default JobImageItem

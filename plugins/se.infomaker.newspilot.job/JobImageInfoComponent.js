import {Component} from 'substance'

class JobImageInfoComponent extends Component {
    render($$) {
        const jobImage = this.props.jobImage

        const infoDiv = $$('div').addClass('imageinfo'),
            ulDiv = $$('ul'),
            liImage = $$('li'),
            liInfo = $$('li').addClass('infolist'),
            image = $$('img').attr('src', jobImage.url)

        const nameLabel = this._createLabel($$, this.getLabel('Name'))
        const name = this._createLabelValue($$, jobImage.name)

        const createdLabel = this._createLabel($$, this.getLabel('Created'))
        const created = this._createLabelValue($$, jobImage.created)

        const photographerLabel = this._createLabel($$, this.getLabel('Photographer'))
        const photographer = this._createLabelValue($$, jobImage.photographer)

        const proposedCaptionLabel = this._createLabel($$, this.getLabel('Proposed caption'))
        const proposedCaption = this._createLabelValue($$, jobImage.proposedCaption)

        liInfo.append([
            nameLabel, name,
            createdLabel, created,
            photographerLabel, photographer,
            proposedCaptionLabel, proposedCaption
        ])

        liImage.append(image)
        ulDiv.append([liImage, liInfo])
        infoDiv.append(ulDiv)

        return infoDiv
    }

    onClose() {
        // Needed in order to close dialog
    }

    _createLabel($$, label) {
        return $$('span').addClass('infolabel').append($$('strong').append(label + ':'))
    }

    _createLabelValue($$, value) {
        const safeValue = value ? value : '-'
        return $$('span').addClass('infovalue').append(safeValue)
    }
}

export default JobImageInfoComponent

import { Component, FontAwesomeIcon as Icon } from 'substance'
import { api } from 'writer'


class CampaignIdComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'adinfo'
    }

    render($$) {
        const el = $$('div').addClass('campaignId')

        const campaignIdTitle = $$('h2').append(this.getLabel('adinfo-campaign-id'))
        let campaignIdDisplay = (this.props.campaignId) ? this._renderCapaignIdDisplay($$) : ''
        const campaignIdInput = this._renderCampaignIdInput($$)

        el.append([campaignIdTitle, campaignIdDisplay, campaignIdInput])
        return el
    }

    _renderCapaignIdDisplay($$) {
        const campaignIdDisplay = $$('div')
            .addClass('tag-list__item')
            .ref('campaignIdDisplay')

        const campaignIdLabel = $$('span')
            .addClass('tag-item__title tag-item__title--no-avatar')

        const displayName = this.props.campaignId

        campaignIdLabel
            .append(displayName)
            .attr('title', displayName)

        campaignIdDisplay.append([
            campaignIdLabel,
            $$('span').append($$(Icon, {icon: 'fa-times'})
                .addClass('tag-icon tag-icon--delete')
                .attr('title', this.getLabel('Remove from article')))
                .on('click', () => {
                    this.props.setCampaignId('')
                }),
            $$(Icon, {icon: 'fa-hashtag'})
                .addClass('tag-icon')
        ])

        return campaignIdDisplay;
    }

    _renderCampaignIdInput($$) {
        return $$('div').addClass('search__container').append(
            $$('div').addClass('form-group').append(
                $$('input').addClass('form-control form__search')
                .ref('keywordInput')
                .attr('placeholder', api.getLabel('adinfo-set-campaign-id'))
                .on('keydown', this.handleCampaignIdInput)
            )
        )
    }

    handleCampaignIdInput(e) {
        if (e.keyCode === 13) {
            const campaignId = e.srcElement.value
            this.props.setCampaignId(campaignId)
            e.srcElement.value = ''
        }
    }
}

export default CampaignIdComponent

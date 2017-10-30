import { Component, FontAwesomeIcon as Icon } from 'substance'
import { api } from 'writer'
import InputSelectionComponent from './InputSelectionComponent'

class CampaignIdComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'admeta'
    }

    render($$) {
        const el = $$('div').addClass('campaign-id')

        const campaignIdTitle = $$('h2').append(this.getLabel('admeta-campaign-id'))
        let campaignIdDisplay = (this.props.campaignId) ? this._renderCapaignIdDisplay($$) : ''
        const campaignIdInput = this._renderCampaignIdInput($$)
        const campaignIdSelection = $$(InputSelectionComponent, {
            inputValue: this.state.inputValue,
            onSelect: this.setCampaignId.bind(this)
        })

        el.append([campaignIdTitle, campaignIdDisplay, campaignIdInput, campaignIdSelection])
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

        return campaignIdDisplay.append([
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
    }

    _renderCampaignIdInput($$) {
        return $$('div').addClass('search__container').append(
            $$('div').addClass('form-group').append(
                $$('input').addClass('form-control form__search')
                .ref('campaignIdInput')
                .attr('placeholder', api.getLabel('admeta-set-campaign-id'))
                .on('keydown', this.handleCampaignIdInput.bind(this))
                .on('input', this.updateInputSelection.bind(this))
            )
        )
    }

    handleCampaignIdInput(e) {
        if (e.keyCode === 13) {
            this.setCampaignId()
        }
    }

    setCampaignId() {
        const campaignIdElem = this.refs.campaignIdInput
        this.props.setCampaignId(campaignIdElem.val())
        this.extendState({ inputValue: '' })
        campaignIdElem.val('')
    }

    updateInputSelection() {
        const campaignIdElem = this.refs.campaignIdInput
        this.extendState({ inputValue: campaignIdElem.val() })
    }
}

export default CampaignIdComponent

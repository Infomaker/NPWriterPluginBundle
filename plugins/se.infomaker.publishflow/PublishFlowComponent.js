const {Component} = substance
const {api, moment} = writer
const pluginId = 'se.infomaker.publishflow'

class PublishFlowComponent extends Component {
    constructor(...args) {
        super(...args)

        api.events.on(pluginId, 'document:changed', () => {
            this.props.setButtonText(
                this.getLabel('Save *')
            )
        })

        api.events.on(pluginId, 'document:saved', () => {
            this._onDocumentSaved()
        })
    }

    dispose() {}

    getInitialState() {
        return {
            status: api.newsItem.getPubStatus(),
            pubStart: api.newsItem.getPubStart(),
            pubStop: api.newsItem.getPubStop()
        }
    }

    didMount() {
        this.props.setButtonText(
            this.getLabel('Save')
        )

        this._updateStatus()

        if (!api.browser.isSupported()) {
            this.props.disable()
        }
    }

    render($$) {
        var el = $$('div')
            .css('margin', '10px')
            .append('Hello Mr NPWriter 2.0')

        return el
    }

    defaultAction() {
        this.props.disable()
        this.props.setIcon('fa-refresh fa-spin fa-fw')

        api.newsItem.save()
    }

    _onDocumentSaved() {
        this.props.setButtonText(
            this.getLabel('Save')
        )

        this.props.setIcon('fa-ellipsis-h')
        this.props.enable()
    }

    _updateStatus() {
        if (this.state.status.qcode === 'stat:usable') {
            this.props.setStatusText(
                this.getLabel(this.state.status.qcode) +
                " " +
                moment(this.state.pubStart).fromNow()
            )
        }
        else if (this.state.status.qcode === 'stat:withheld') {
            this.props.setStatusText(
                this.getLabel(this.state.status.qcode) +
                " " +
                moment(this.state.pubStart).fromNow()
            )
        }
        else {
            this.props.setStatusText(
                this.getLabel(this.state.status.qcode)
            )
        }
    }
}

export default PublishFlowComponent

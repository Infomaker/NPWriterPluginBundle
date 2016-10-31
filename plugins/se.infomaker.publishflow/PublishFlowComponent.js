const {Component} = substance

class PublishFlowComponent extends Component {
    constructor(...args) {
        super(...args)
    }

    dispose() {

    }

    getInitialState() {
        return {}
    }

    didMount() {
        this.props.setStatusText('Draft')
        this.props.setButtonText('Save')
    }

    render($$) {
        var el = $$('div')
            .css('margin', '10px')
            .append('Hello Mr NPWriter 2.0')

        return el
    }

    defaultAction() {
        this.props.setIcon('fa-refresh fa-spin fa-fw')
        this.props.disable()

        window.setTimeout(() => {
            this.props.setIcon('fa-ellipsis-h')
            this.props.enable()

        }, 750)
    }
}

export default PublishFlowComponent

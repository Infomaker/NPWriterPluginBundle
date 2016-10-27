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

    render($$) {
        var el = $$('div')
            .css('margin', '10px')
            .append('Hello Mr NPWriter 2.0')

        return el
    }
}

export default PublishFlowComponent

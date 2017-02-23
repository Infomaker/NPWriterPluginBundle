import {Component} from 'substance'

class NoConnection extends Component {

    render($$) {

        const el = $$('div')

        el.append($$('h2').append(this.getLabel('no-connection-headline')))
        el.append($$('p').append(this.getLabel('no-connection-description')))

        return el
    }
}

export default NoConnection
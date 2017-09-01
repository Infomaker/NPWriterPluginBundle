import {Component} from 'substance'

class TeaserContainerComponent extends Component {

    render($$) {
        return $$('span').append('Hello container')
    }

}

export default TeaserContainerComponent
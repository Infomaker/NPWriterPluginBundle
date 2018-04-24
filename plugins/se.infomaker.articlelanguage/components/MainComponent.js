import {Component} from 'substance'

/**
 * @class MainComponent
 */
class MainComponent extends Component {

    render($$) {
        return $$('div').addClass('im-articlelanguage').append(
            $$('h2').append(this.getLabel('Article Language')),
            $$('p').append('Hello World')
        )
    }
}

export default MainComponent

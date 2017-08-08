import {Component} from 'substance'
import {api, event} from 'writer'

class FacebookComponent extends Component {

    constructor(...args) {
        super(...args)

        api.events.on('socialembed', event.FACEBOOK_READY, () => {
            this.loadFacebook()
        })
    }

    loadFacebook() {
        if(window.FB) {
            FB.XFBML.parse(this.getNativeElement())
        }
    }

    didMount() {
        this.loadFacebook()
    }
    render($$) {
        return $$('div').html(this.props.node.html)
    }
}

export default FacebookComponent
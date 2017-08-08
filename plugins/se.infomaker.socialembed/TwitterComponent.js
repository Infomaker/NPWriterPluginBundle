import {Component} from 'substance'
import {api, event} from 'writer'

class TwitterComponent extends Component {

    constructor(...args) {
        super(...args)

        api.events.on('socialembed', event.TWITTER_READY, () => {
            this.loadTwitter()
        })

    }

    loadTwitter() {
        if (window.twttr) {
            twttr.widgets.load(this.getNativeElement())
        }
    }

    didMount() {
        this.loadTwitter()
    }

    render($$) {
        return $$('div').html(this.props.node.html)
    }
}

export default TwitterComponent
import {Component} from 'substance'
import {api, event} from 'writer'


class HistoryMainComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    render($$) {

        const el = $$('div').ref('externalUpdateContainer').addClass('light').append(
            [
                $$('h2').append('*** External Update ***'),
                $$('button').on('click', () => api.newsItemMutation.setEdNote({change: 'Hello folks', eventType: 'external:changed'}))
            ]
        )

        return el;
    }


    handleExternalUpdateMessage(message) {

    }

}

export default HistoryMainComponent

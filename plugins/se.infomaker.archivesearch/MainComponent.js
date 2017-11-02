import {Component} from 'substance'
import {api} from 'writer'

class ArchivesearchComponent extends Component {
    render($$) {
        return $$('div').append(
            $$('h2').append(
                'Bildarkivsökning'
            )
        )
    }
}

export default ArchivesearchComponent

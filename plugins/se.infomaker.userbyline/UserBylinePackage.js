import { UserBylineComponent } from './components/UserBylineComponent'

import './scss/index.scss'
import './scss/author-suggestion.scss'

export default {
    name: 'im-user-byline',
    id: 'se.infomaker.user-byline',
    version: '{{version}}',
    configure(configurator) {
        configurator.addTopBarComponent('user', { align: 'right' }, UserBylineComponent)
    }
}

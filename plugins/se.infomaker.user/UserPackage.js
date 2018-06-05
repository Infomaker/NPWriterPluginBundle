import './scss/index.scss'
import {UserComponent} from './components/UserComponent'

export default {
    name: 'im-user',
    id: 'se.infomaker.user',
    version: '{{version}}',
    configure: function(configurator, pluginConfig) {

        configurator.addTopBarComponent('user', { align: 'right' }, UserComponent)

    }
}

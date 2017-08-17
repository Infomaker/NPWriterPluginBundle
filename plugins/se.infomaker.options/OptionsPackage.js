// import './scss/options.scss'

import OptionsComponent from './OptionsComponent'

export default {
    name: 'options',
    version: '{{version}}',
    configure: function (config, configObject) {

        config.addComponentToSidebarWithTabId(
            configObject.id,
            configObject.tabid || 'main',
            OptionsComponent,
            configObject
        )
    }
}

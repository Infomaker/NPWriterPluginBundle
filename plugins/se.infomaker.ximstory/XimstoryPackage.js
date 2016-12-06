import './scss/ximstory.scss'

import StoryMainComponent from './StoryMainComponent'

export default {
    id: 'se.infomaker.ximstory',
    name: 'ximstory',

    configure: function(config) {
        config.addComponentToSidebarWithTabId(this.id, 'main', StoryMainComponent)
    }
}

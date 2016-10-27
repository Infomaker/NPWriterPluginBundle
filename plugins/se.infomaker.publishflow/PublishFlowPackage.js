import PublishFlowComponent from './PublishFlowComponent'

export default {
    name: 'publishflow',
    id: 'se.infomaker.publishflow',
    configure: function (config) {
        config.addPopover(
            this.id,
            'fa-calendar',
            'right',
            PublishFlowComponent
        )
    }
}

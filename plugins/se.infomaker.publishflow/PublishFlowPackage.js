import PublishFlowComponent from './PublishFlowComponent'

export default {
    name: 'publishflow',
    id: 'se.infomaker.publishflow',
    configure: function (config) {
        config.addPopover(
            this.id + '_1',
            {
                icon: 'fa-ellipsis-h',
                button: true,
                align: 'right'
            },
            PublishFlowComponent
        )
    }
}

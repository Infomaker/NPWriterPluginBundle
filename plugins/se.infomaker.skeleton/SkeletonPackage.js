import SkeletonComponent from './SkeletonComponent'

export default {
    name: "skeleton",
    id: 'se.infomaker.skeleton',
    configure: function (config, pluginConfig) {

        config.addToSidebar('main', pluginConfig, SkeletonComponent)

        config.addLabel('skeleton-title', {
            en: "Skeleton plugin",
            sv: "Skelettplugin"
        })
    }
}

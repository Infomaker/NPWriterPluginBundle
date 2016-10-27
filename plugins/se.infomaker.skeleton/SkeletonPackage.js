import SkeletonComponent from './SkeletonComponent'

export default {
    name: "skeleton",
    id: 'se.infomaker.skeleton',
    configure: function (config) {
        config.addComponentToSidebarTop(this.id, SkeletonComponent)
        // config.addComponentToSidebarWithTabId(this.id, 'main', SkeletonComponent)
    }
}
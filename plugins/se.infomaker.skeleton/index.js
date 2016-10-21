import SkeletonPackage from './SkeletonPackage'
const {registerPlugin} = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(SkeletonPackage)
    } else {
        console.error("Register method not yet available");
    }
}



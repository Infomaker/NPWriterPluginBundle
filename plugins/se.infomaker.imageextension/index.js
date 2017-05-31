import ImageExtensionPackage from './ImageExtensionPackage'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(ImageExtensionPackage)
    } else {
        console.info("Register method not yet available");
    }
}

import AdmetaPackage from './AdmetaPackage'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(AdmetaPackage)
    } else {
        console.error('Register method not yet available')
    }
}

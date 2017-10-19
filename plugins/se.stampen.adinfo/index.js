import AdinfoPackage from './AdinfoPackage'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(AdinfoPackage)
    } else {
        console.error('Register method not yet available')
    }
}

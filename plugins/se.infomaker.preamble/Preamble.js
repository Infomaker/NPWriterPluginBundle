import PreamblePackage from './PreamblePackage'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(PreamblePackage)
    } else {
        console.log("Register method not yet available");
    }

}



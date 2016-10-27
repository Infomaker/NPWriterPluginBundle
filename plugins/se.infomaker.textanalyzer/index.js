import AnalyzerPackage from './TextAnalyzerPackage'
const {registerPlugin} = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(AnalyzerPackage)
    } else {
        console.info("Register method not yet available");
    }
}



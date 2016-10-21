import AnalyzerPackage from './TextAnalyzerPackage'
const {registerPlugin} = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(AnalyzerPackage)
    } else {
        console.log("Register method not yet available");
    }
}



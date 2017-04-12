import AnalyzerPackage from './TextAnalyzerPackage'
import {registerPlugin} from "writer"

(() => {
    if (registerPlugin) {
        registerPlugin(AnalyzerPackage)
    } else {
        console.info("Register method not yet available");
    }
})()

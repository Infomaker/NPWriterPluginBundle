import PublishFlowPackage from './PublishFlowPackage'
import {registerPlugin} from "writer"

(() => {
    if (registerPlugin) {
        registerPlugin(PublishFlowPackage)
    }
    else {
        console.info("Register method not yet available");
    }
})()

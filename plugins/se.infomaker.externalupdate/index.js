import ExternalUpdatePackage from "./ExternalUpdatePackage"
import {registerPlugin} from "writer"

export default () => {
    if (registerPlugin) {
        registerPlugin(ExternalUpdatePackage)
    } else {
        console.error("Register method not yet available");
    }
}

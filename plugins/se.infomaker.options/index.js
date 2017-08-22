import OptionsPackage from "./OptionsPackage"
import {registerPlugin} from "writer"

export default () => {
    if (registerPlugin) {
        registerPlugin(OptionsPackage)
    }
    else {
        console.error("Register method not yet available")
    }
}

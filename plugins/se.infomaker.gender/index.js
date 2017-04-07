import GenderPackage from "./GenderPackage"
import {registerPlugin} from "writer"

export default () => {
    if (registerPlugin) {
        registerPlugin(GenderPackage)
    } else {
        console.error("Register method not yet available");
    }
}
import GenderPackage from "./GenderPackage"
import {registerPlugin} from "writer"

(() => {
    if (registerPlugin) {
        registerPlugin(GenderPackage)
    } else {
        console.error("Register method not yet available");
    }
})()

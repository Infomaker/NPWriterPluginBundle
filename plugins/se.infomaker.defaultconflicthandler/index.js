import DefaultConflictHandlerPackage from "./DefaultConflictHandlerPackage"
import {registerPlugin} from "writer"

(() => {
    if (registerPlugin) {
        registerPlugin(DefaultConflictHandlerPackage)
    } else {
        console.error("Register method not yet available");
    }
})()

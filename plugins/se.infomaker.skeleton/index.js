import SkeletonPackage from './SkeletonPackage'
import {registerPlugin} from "writer"

(() => {
    if (registerPlugin) {
        registerPlugin(SkeletonPackage)
    } else {
        console.error("Register method not yet available");
    }
})()

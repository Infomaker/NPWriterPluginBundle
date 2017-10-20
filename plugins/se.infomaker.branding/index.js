import BrandingPackage from "./BrandingPackage"
import {registerPlugin} from "writer"

export default () => {
    if (registerPlugin) {
        registerPlugin(BrandingPackage)
    }
    else {
        console.error("Register method not yet available")
    }
}

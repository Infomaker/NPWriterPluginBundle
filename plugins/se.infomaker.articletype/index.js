import ArticleTypePackage from "./ArticleTypePackage"
import {registerPlugin} from "writer"

export default () => {
    if (registerPlugin) {
        registerPlugin(ArticleTypePackage)
    } else {
        console.error("Register method not yet available");
    }
}
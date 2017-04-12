import NewsPriority from './NewsPriority'
import {registerPlugin} from "writer"

(() => {
    if (registerPlugin) {
        registerPlugin(NewsPriority)
    } else {
        console.info("Register method not yet available");
    }
})()

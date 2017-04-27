import NewsPriority from './NewsPriority'
import {registerPlugin} from "writer"

(() => {
    console.log("Run index!");
    if (registerPlugin) {
        registerPlugin(NewsPriority)
    } else {
        console.info("Register method not yet available");
    }
})()

import NewsPriority from './NewsPriority'
const {registerPlugin} = writer

(() => {
    if (registerPlugin) {
        registerPlugin(NewsPriority)
    } else {
        console.info("Register method not yet available");
    }
})()

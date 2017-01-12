import './scss/ximsection.scss'
import Ximsection from './Ximsection'

const {registerPlugin} = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(Ximsection)
    }
    else {
        console.info("Register method not yet available");
    }
}


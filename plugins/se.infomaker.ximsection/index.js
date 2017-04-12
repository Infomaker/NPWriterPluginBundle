import './scss/ximsection.scss'
import {registerPlugin} from 'writer'
import Ximsection from './Ximsection'

(() => {
    if (registerPlugin) {
        registerPlugin(Ximsection)
    }
    else {
        console.info("Register method not yet available");
    }
})()


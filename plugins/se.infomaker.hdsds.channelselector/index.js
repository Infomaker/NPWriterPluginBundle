import ChannelSelector from './Channelselector'
import {registerPlugin} from 'writer'

(() => {
    if (registerPlugin) {
        registerPlugin(ChannelSelector)
    } else {
        console.info("Register method not yet available");
    }
})()

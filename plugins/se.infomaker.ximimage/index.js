import './scss/image-display.scss'
import './scss/ximimage.scss'
import './scss/display-modes.scss'
import { registerPlugin } from 'writer'

import XimimagePackage from './XimimagePackage'

export default () => {
    if (registerPlugin) {
        registerPlugin(XimimagePackage)
    } else {
        console.info("Register method not yet available");
    }
}

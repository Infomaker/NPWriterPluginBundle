//import './scss/image-display.scss'
import './scss/ximpdf.scss'

import XimpdfPackage from './XimpdfPackage'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(XimpdfPackage)
    } else {
        console.info("Register method not yet available");
    }
}

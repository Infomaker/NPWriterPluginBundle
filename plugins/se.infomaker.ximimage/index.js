import './scss/image-display.scss'
import './scss/ximimage.scss'
import './scss/imagecropper.scss'

import XimimagePackage from './XimimagePackage'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(XimimagePackage)
    } else {
        console.info("Register method not yet available");
    }
}

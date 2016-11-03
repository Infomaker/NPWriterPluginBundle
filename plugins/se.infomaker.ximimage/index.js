import './scss/ximimage.scss'

import XimimagePackage from './XimimagePackage'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(XimimagePackage)
    } else {
        console.info("Register method not yet available");
    }
}

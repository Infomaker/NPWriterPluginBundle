import './scss/ximteaser.scss'

import XimteaserPackage from './XimteaserPackage'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(XimteaserPackage)
    } else {
        console.info("Register method not yet available");
    }
}

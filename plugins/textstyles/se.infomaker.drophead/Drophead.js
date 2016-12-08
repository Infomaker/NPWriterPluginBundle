import './scss/drophead.scss'

import DropheadPackage from './DropheadPackage'

const {registerPlugin} = writer


export default () => {
    if (registerPlugin) {
        registerPlugin(DropheadPackage)
    } else {
        console.error("Could not register plugin");
    }
}



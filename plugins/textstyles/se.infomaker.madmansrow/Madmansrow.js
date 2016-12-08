import './scss/madmansrow.scss'

import MadmansrowPackage from './MadmansrowPackage'

const {registerPlugin} = writer


export default () => {
    if (registerPlugin) {
        registerPlugin(MadmansrowPackage)
    } else {
        console.error("Could not register plugin");
    }
}


